<?php

use App\Events\StudentEnrolledEvent;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Notifications\StudentEnrolledNotification;

test('enrollment creates database notifications for all admin users with formatted student name', function () {
    $admin1 = User::factory()->create([
        'name' => 'Admin One',
        'role' => 'admin',
    ]);
    $admin2 = User::factory()->create([
        'name' => 'Admin Two',
        'role' => 'admin',
    ]);
    $student = User::factory()->create([
        'name' => 'rahul sharma',
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Development',
        'slug' => 'dev-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Mastering Laravel & Inertia',
        'slug' => 'mastering-laravel-inertia-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    StudentEnrolledEvent::dispatchSafely($enrollment);

    expect($admin1->notifications()->count())->toBe(1);
    expect($admin2->notifications()->count())->toBe(1);

    $notif1 = $admin1->notifications()->first();
    expect($notif1->type)->toBe(StudentEnrolledNotification::class);
    expect($notif1->data['student_name'])->toBe('Rahul Sharma');
    expect($notif1->data['course_title'])->toBe('Mastering Laravel & Inertia');
    expect($notif1->data['enrollment_id'])->toBe($enrollment->id);
    expect($notif1->read_at)->toBeNull();
});

test('admin can mark a notification as read', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['name' => 'Jane Doe', 'role' => 'student']);
    $category = Category::create([
        'name' => 'General',
        'slug' => 'general-'.uniqid(),
        'status' => 'active',
    ]);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course',
        'slug' => 'test-course-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $admin->notify(new StudentEnrolledNotification($enrollment));

    $notification = $admin->unreadNotifications()->first();
    expect($notification)->not->toBeNull();

    $response = $this->actingAs($admin)
        ->post(route('notifications.read', $notification->id));

    $response->assertOk()
        ->assertJson(['success' => true]);

    expect($admin->unreadNotifications()->count())->toBe(0);
    expect($admin->notifications()->first()->read_at)->not->toBeNull();
});

test('admin can mark all notifications as read', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['name' => 'Jane Doe', 'role' => 'student']);
    $category = Category::create([
        'name' => 'General',
        'slug' => 'general-'.uniqid(),
        'status' => 'active',
    ]);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Course A',
        'slug' => 'course-a-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $admin->notify(new StudentEnrolledNotification($enrollment));
    $admin->notify(new StudentEnrolledNotification($enrollment));

    expect($admin->unreadNotifications()->count())->toBe(2);

    $response = $this->actingAs($admin)
        ->post(route('notifications.readAll'));

    $response->assertOk()
        ->assertJson(['success' => true]);

    expect($admin->unreadNotifications()->count())->toBe(0);
});

test('admin can clear all notifications', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['name' => 'Jane Doe', 'role' => 'student']);
    $category = Category::create([
        'name' => 'General',
        'slug' => 'general-'.uniqid(),
        'status' => 'active',
    ]);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Course A',
        'slug' => 'course-a-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $admin->notify(new StudentEnrolledNotification($enrollment));
    $admin->notify(new StudentEnrolledNotification($enrollment));

    expect($admin->notifications()->count())->toBe(2);

    $response = $this->actingAs($admin)
        ->delete(route('notifications.clear'));

    $response->assertOk()
        ->assertJson(['success' => true]);

    expect($admin->notifications()->count())->toBe(0);
});

test('unauthenticated guest cannot access notification routes', function () {
    $this->post(route('notifications.read', 'some-id'))
        ->assertRedirect(route('login'));

    $this->post(route('notifications.readAll'))
        ->assertRedirect(route('login'));

    $this->delete(route('notifications.clear'))
        ->assertRedirect(route('login'));
});

test('HandleInertiaRequests shares admin_notifications array to admin users', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['name' => 'Jane Doe', 'role' => 'student']);
    $category = Category::create([
        'name' => 'General',
        'slug' => 'general-'.uniqid(),
        'status' => 'active',
    ]);
    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Course A',
        'slug' => 'course-a-'.uniqid(),
        'price' => 0,
        'status' => 'published',
    ]);
    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $admin->notify(new StudentEnrolledNotification($enrollment));

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('admin_notifications', 1)
        ->where('admin_notifications.0.studentName', 'Jane Doe')
        ->where('admin_notifications.0.courseTitle', 'Course A')
        ->where('admin_notifications.0.read', false)
    );
});
