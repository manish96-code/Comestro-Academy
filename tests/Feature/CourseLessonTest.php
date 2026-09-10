<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseLesson;
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
        'course_type' => 'recorded',
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
    $this->assertDatabaseHas('course_lessons', [
        'course_id' => $this->course->id,
        'module_name' => 'Module 1: Setup',
        'title' => 'Installing PHP & Composer',
        'duration' => '15m',
        'is_free_preview' => 1,
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
    $this->assertDatabaseHas('course_lessons', [
        'course_id' => $this->course->id,
        'title' => 'Cheat Sheet & Architecture',
        'notes_file' => 'https://ik.imagekit.io/test/notes/cheat_sheet.pdf',
        'notes_title' => 'Laravel Setup Cheatsheet',
    ]);
});

test('admin can update a lesson', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $lesson = CourseLesson::create([
        'course_id' => $this->course->id,
        'module_name' => 'Intro',
        'title' => 'Old Title',
        'order' => 1,
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
        'module_name' => 'Module 1: Intro',
        'is_free_preview' => 1,
    ]);
});

test('admin can delete a lesson', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $lesson = CourseLesson::create([
        'course_id' => $this->course->id,
        'module_name' => 'Intro',
        'title' => 'To Be Deleted',
        'order' => 1,
        'is_free_preview' => false,
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.courses.lessons.destroy', [$this->course->id, $lesson->id]));

    $response->assertRedirect();
    $this->assertDatabaseMissing('course_lessons', [
        'id' => $lesson->id,
    ]);
});

test('students can view lessons on the public course show page', function () {
    CourseLesson::create([
        'course_id' => $this->course->id,
        'module_name' => 'Getting Started',
        'title' => 'Introduction to Laravel',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'duration' => '10m',
        'is_free_preview' => true,
        'order' => 1,
    ]);

    $response = $this->get(route('courses.show', $this->course->slug));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Courses/Show')
        ->has('course.lessons', 1)
        ->where('course.lessons.0.title', 'Introduction to Laravel')
    );
});
