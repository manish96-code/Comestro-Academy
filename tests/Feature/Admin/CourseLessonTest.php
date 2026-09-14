<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Http\UploadedFile;

beforeEach(function () {
    $this->category = Category::create([
        'name' => 'Backend Development',
        'slug' => 'backend-development',
        'status' => 'active',
    ]);

    $this->course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Mastering Laravel 12',
        'slug' => 'mastering-laravel-12',
        'price' => 2999,
        'status' => 'published',
    ]);
});

test('admin can view course content and lessons management page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.courses.content', $this->course->id));

    $response->assertOk();
});

test('admin can create a lesson for a course', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $this->course->id), [
        'module_name' => 'Module 1: Setup',
        'title' => 'Installing PHP & Composer',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'duration' => '15m',
        'description' => 'First lecture setting up our dev environment.',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('course_modules', [
        'course_id' => $this->course->id,
        'title' => 'Module 1: Setup',
    ]);

    $module = CourseModule::where('course_id', $this->course->id)->where('title', 'Module 1: Setup')->first();

    $this->assertDatabaseHas('course_lessons', [
        'module_id' => $module->id,
        'title' => 'Installing PHP & Composer',
    ]);

    $lesson = CourseLesson::where('module_id', $module->id)->first();

    $this->assertDatabaseHas('lesson_videos', [
        'lesson_id' => $lesson->id,
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'duration_seconds' => 900,
    ]);
});

test('admin can create lesson with notes file upload via ImageKit', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $imageKitMock = mock(ImageKitService::class);
    $imageKitMock->shouldReceive('upload')
        ->once()
        ->andReturn(['url' => 'https://ik.imagekit.io/test/notes/cheat_sheet.pdf', 'fileId' => 'test-id', 'name' => 'cheat_sheet.pdf']);
    $this->app->instance(ImageKitService::class, $imageKitMock);

    $fakePdf = UploadedFile::fake()->create('cheat_sheet.pdf', 500, 'application/pdf');

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $this->course->id), [
        'module_name' => 'Module 1: Setup',
        'title' => 'Cheat Sheet & Architecture',
        'notes_file' => $fakePdf,
        'notes_title' => 'Laravel Setup Cheatsheet',
    ]);

    $response->assertRedirect();

    $module = CourseModule::where('course_id', $this->course->id)->where('title', 'Module 1: Setup')->first();
    $lesson = CourseLesson::where('module_id', $module->id)->first();

    $this->assertDatabaseHas('lesson_resources', [
        'lesson_id' => $lesson->id,
        'title' => 'Laravel Setup Cheatsheet',
        'file_url' => 'https://ik.imagekit.io/test/notes/cheat_sheet.pdf',
        'resource_type' => 'pdf',
    ]);
});

test('admin can update a lesson', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Intro',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Old Title',
        'sort_order' => 1,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.update', [$this->course->id, $lesson->id]), [
        'module_name' => 'Module 1: Intro',
        'title' => 'Updated Title',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('course_lessons', [
        'id' => $lesson->id,
        'title' => 'Updated Title',
    ]);

    $this->assertDatabaseHas('course_modules', [
        'course_id' => $this->course->id,
        'title' => 'Module 1: Intro',
    ]);
});

test('admin can delete a lesson', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Intro',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'To Be Deleted',
        'sort_order' => 1,
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.courses.lessons.destroy', [$this->course->id, $lesson->id]));

    $response->assertRedirect();
    $this->assertDatabaseMissing('course_lessons', [
        'id' => $lesson->id,
    ]);
});

test('students can view syllabus overview on the public course show page', function () {
    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Getting Started',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Introduction to Laravel',
        'sort_order' => 1,
    ]);

    $response = $this->get(route('courses.show', $this->course->slug));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Courses/Show')
        ->has('course.modules', 1)
        ->where('course.modules.0.title', 'Getting Started')
    );
});

test('enrolled student can access the course learning classroom page to watch lessons and access notes', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Getting Started',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Introduction to Laravel',
        'sort_order' => 1,
    ]);

    $lesson->videos()->create([
        'title' => 'Intro Video',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'duration_seconds' => 600,
        'status' => 'ready',
    ]);

    $response = $this->actingAs($student)->get(route('student.courses.learn', $this->course->id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Courses/Learn')
        ->has('course.modules', 1)
        ->where('course.modules.0.lessons.0.title', 'Introduction to Laravel')
    );
});

test('unenrolled student is redirected from course learning classroom page', function () {
    $student = User::factory()->create(['role' => 'student']);

    $response = $this->actingAs($student)->get(route('student.courses.learn', $this->course->id));

    $response->assertRedirect(route('courses.show', $this->course->slug));
});

test('enrolled student can toggle a lesson as completed and uncompleted', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Getting Started',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Introduction to Laravel',
        'sort_order' => 1,
    ]);

    // Mark as completed
    $response = $this->actingAs($student)->post(route('student.courses.lessons.toggle-complete', [
        'course' => $this->course->id,
        'lesson' => $lesson->id,
    ]));

    $response->assertRedirect();
    $this->assertDatabaseHas('lesson_completions', [
        'user_id' => $student->id,
        'lesson_id' => $lesson->id,
    ]);

    // Toggle again to uncomplete
    $response2 = $this->actingAs($student)->post(route('student.courses.lessons.toggle-complete', [
        'course' => $this->course->id,
        'lesson' => $lesson->id,
    ]));

    $response2->assertRedirect();
    $this->assertDatabaseMissing('lesson_completions', [
        'user_id' => $student->id,
        'lesson_id' => $lesson->id,
    ]);
});

test('unenrolled student cannot toggle lesson completion', function () {
    $student = User::factory()->create(['role' => 'student']);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Getting Started',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Introduction to Laravel',
        'sort_order' => 1,
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.lessons.toggle-complete', [
        'course' => $this->course->id,
        'lesson' => $lesson->id,
    ]));

    $response->assertRedirect();
    $this->assertDatabaseMissing('lesson_completions', [
        'user_id' => $student->id,
        'lesson_id' => $lesson->id,
    ]);
});

test('course learning classroom page provides progress and completedLessonIds to Inertia', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Getting Started',
        'sort_order' => 1,
    ]);

    $lesson1 = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);

    $lesson2 = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 2',
        'sort_order' => 2,
    ]);

    // Complete lesson 1
    $student->completedLessons()->attach($lesson1->id, ['completed_at' => now()]);

    $response = $this->actingAs($student)->get(route('student.courses.learn', $this->course->id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Courses/Learn')
        ->has('progress')
        ->where('progress.total_lessons', 2)
        ->where('progress.completed_lessons', 1)
        ->where('progress.progress_percentage', 50)
        ->where('completedLessonIds', [$lesson1->id])
    );
});

test('enrolled courses list provides course progress data to Inertia', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Getting Started',
        'sort_order' => 1,
    ]);

    $lesson1 = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);

    $student->completedLessons()->attach($lesson1->id, ['completed_at' => now()]);

    $response = $this->actingAs($student)->get(route('student.courses.enrolled'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Courses/Enrolled')
        ->has('enrollments.data.0.course.progress')
        ->where('enrollments.data.0.course.progress.total_lessons', 1)
        ->where('enrollments.data.0.course.progress.completed_lessons', 1)
        ->where('enrollments.data.0.course.progress.progress_percentage', 100)
    );
});
