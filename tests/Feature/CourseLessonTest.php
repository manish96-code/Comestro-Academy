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
        'is_free_preview' => true,
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
        'is_free_preview' => 1,
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
        'is_free_preview' => false,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.update', [$this->course->id, $lesson->id]), [
        'module_name' => 'Module 1: Intro',
        'title' => 'Updated Title',
        'is_free_preview' => true,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('course_lessons', [
        'id' => $lesson->id,
        'title' => 'Updated Title',
        'is_free_preview' => 1,
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
        'is_free_preview' => false,
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
        'is_free_preview' => true,
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
        'is_free_preview' => false,
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
