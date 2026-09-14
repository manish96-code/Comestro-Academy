<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Notifications\CourseContentAddedNotification;
use Illuminate\Support\Facades\Broadcast;

test('adding a lesson creates database notifications for all active enrolled students', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $enrolledStudent = User::factory()->create([
        'name' => 'Alice Smith',
        'role' => 'student',
        'status' => 'active',
    ]);
    $otherStudent = User::factory()->create([
        'name' => 'Bob Jones',
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Web Development',
        'slug' => 'web-dev-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'React & Laravel Mastery',
        'slug' => 'react-laravel-mastery-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);

    // Enroll only Alice
    Enrollment::create([
        'user_id' => $enrolledStudent->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    // Admin adds a lesson
    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $course->id), [
        'module_name' => 'Module 1: Introduction',
        'title' => 'Getting Started with Inertia v2',
        'description' => 'First lecture of this module',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'duration' => '10:30',
    ]);

    $response->assertSessionHas('success');

    // Alice should receive 1 notification
    expect($enrolledStudent->notifications()->count())->toBe(1);
    // Bob should receive 0 notifications
    expect($otherStudent->notifications()->count())->toBe(0);

    $notification = $enrolledStudent->notifications()->first();
    expect($notification->type)->toBe(CourseContentAddedNotification::class);
    expect($notification->data['course_title'])->toBe('React & Laravel Mastery');
    expect($notification->data['module_name'])->toBe('Module 1: Introduction');
    expect($notification->data['lesson_title'])->toBe('Getting Started with Inertia v2');
    expect($notification->data['is_new_module'])->toBeTrue();
    expect($notification->data['type'])->toBe('module_added');
    expect($notification->read_at)->toBeNull();
});

test('adding a lesson under an existing module sets is_new_module to false', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student', 'status' => 'active']);

    $category = Category::create([
        'name' => 'Backend',
        'slug' => 'backend-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'PHP Mastery',
        'slug' => 'php-mastery-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    // First lesson creates module
    $this->actingAs($admin)->post(route('admin.courses.lessons.store', $course->id), [
        'module_name' => 'Module 1: Basics',
        'title' => 'Lecture 1: Syntax',
    ]);

    // Second lesson under same module
    $this->actingAs($admin)->post(route('admin.courses.lessons.store', $course->id), [
        'module_name' => 'Module 1: Basics',
        'title' => 'Lecture 2: Control Structures',
    ]);

    expect($student->notifications()->count())->toBe(2);

    $notifs = $student->notifications()->get();
    $secondNotif = $notifs->first(fn ($n) => ($n->data['lesson_title'] ?? '') === 'Lecture 2: Control Structures');
    expect($secondNotif)->not->toBeNull();
    expect($secondNotif->data['is_new_module'])->toBeFalse();
    expect($secondNotif->data['type'])->toBe('lesson_added');
});

test('student channel authorization allows only the owner student', function () {
    config([
        'broadcasting.default' => 'reverb',
        'broadcasting.connections.reverb.key' => 'test-key',
        'broadcasting.connections.reverb.secret' => 'test-secret',
        'broadcasting.connections.reverb.app_id' => 'test-app',
    ]);
    Broadcast::purge();
    require base_path('routes/channels.php');

    $studentA = User::factory()->create(['role' => 'student']);
    $studentB = User::factory()->create(['role' => 'student']);

    // Student A authorizes for own channel
    $this->actingAs($studentA)
        ->post('/broadcasting/auth', [
            'channel_name' => 'private-student-notifications.'.$studentA->id,
            'socket_id' => '1234.5678',
        ])
        ->assertOk()
        ->assertJsonStructure(['auth']);

    // Student B tries to authorize for Student A channel -> 403 Forbidden
    $this->actingAs($studentB)
        ->post('/broadcasting/auth', [
            'channel_name' => 'private-student-notifications.'.$studentA->id,
            'socket_id' => '1234.5678',
        ])
        ->assertForbidden();
});

test('student can mark a notification as read', function () {
    $student = User::factory()->create(['role' => 'student']);
    $category = Category::create(['name' => 'Test', 'slug' => 'test-'.uniqid(), 'status' => 'active']);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course',
        'slug' => 'test-course-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $module = $course->modules()->create(['title' => 'Module 1', 'sort_order' => 1]);
    $lesson = $module->lessons()->create(['title' => 'Lesson 1', 'sort_order' => 1, 'status' => 'published']);

    $student->notify(new CourseContentAddedNotification($course, $module, $lesson, false));

    $notification = $student->unreadNotifications()->first();
    expect($notification)->not->toBeNull();

    $response = $this->actingAs($student)
        ->post(route('notifications.read', $notification->id));

    $response->assertOk()->assertJson(['success' => true]);
    expect($student->unreadNotifications()->count())->toBe(0);
});

test('student can mark all notifications as read', function () {
    $student = User::factory()->create(['role' => 'student']);
    $category = Category::create(['name' => 'Test', 'slug' => 'test-'.uniqid(), 'status' => 'active']);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course',
        'slug' => 'test-course-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $module = $course->modules()->create(['title' => 'Module 1', 'sort_order' => 1]);
    $lesson = $module->lessons()->create(['title' => 'Lesson 1', 'sort_order' => 1, 'status' => 'published']);

    $student->notify(new CourseContentAddedNotification($course, $module, $lesson, false));
    $student->notify(new CourseContentAddedNotification($course, $module, $lesson, false));

    expect($student->unreadNotifications()->count())->toBe(2);

    $response = $this->actingAs($student)
        ->post(route('notifications.readAll'));

    $response->assertOk()->assertJson(['success' => true]);
    expect($student->unreadNotifications()->count())->toBe(0);
});

test('student can clear all notifications', function () {
    $student = User::factory()->create(['role' => 'student']);
    $category = Category::create(['name' => 'Test', 'slug' => 'test-'.uniqid(), 'status' => 'active']);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course',
        'slug' => 'test-course-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $module = $course->modules()->create(['title' => 'Module 1', 'sort_order' => 1]);
    $lesson = $module->lessons()->create(['title' => 'Lesson 1', 'sort_order' => 1, 'status' => 'published']);

    $student->notify(new CourseContentAddedNotification($course, $module, $lesson, false));
    $student->notify(new CourseContentAddedNotification($course, $module, $lesson, false));

    expect($student->notifications()->count())->toBe(2);

    $response = $this->actingAs($student)
        ->delete(route('notifications.clear'));

    $response->assertOk()->assertJson(['success' => true]);
    expect($student->notifications()->count())->toBe(0);
});

test('HandleInertiaRequests shares student_notifications array to student users', function () {
    $student = User::factory()->create(['role' => 'student']);
    $category = Category::create(['name' => 'Test', 'slug' => 'test-'.uniqid(), 'status' => 'active']);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Inertia Course',
        'slug' => 'inertia-course-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $module = $course->modules()->create(['title' => 'Module 1', 'sort_order' => 1]);
    $lesson = $module->lessons()->create(['title' => 'Lesson 1', 'sort_order' => 1, 'status' => 'published']);

    $student->notify(new CourseContentAddedNotification($course, $module, $lesson, false));

    $response = $this->actingAs($student)->get(route('student.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('student_notifications', 1)
        ->where('student_notifications.0.courseTitle', 'Inertia Course')
        ->where('student_notifications.0.lessonTitle', 'Lesson 1')
        ->where('student_notifications.0.read', false)
    );
});
