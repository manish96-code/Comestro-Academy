<?php

use App\Jobs\UploadLessonNotes;
use App\Jobs\UploadLessonVideo;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

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

test('admin can create lesson with notes file upload via queued job', function () {
    Queue::fake();

    $admin = User::factory()->create(['role' => 'admin']);

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

    expect($lesson)->not->toBeNull();

    Queue::assertPushed(UploadLessonNotes::class, function (UploadLessonNotes $job) use ($lesson) {
        return $job->lesson->id === $lesson->id
            && $job->title === 'Laravel Setup Cheatsheet'
            && $job->metadata['resource_type'] === 'pdf';
    });
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

test('student cannot complete lecture if previous lecture is not completed', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Module 1',
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

    // Attempt to complete lesson 2 directly without completing lesson 1
    $response = $this->actingAs($student)->post(route('student.courses.lessons.toggle-complete', [
        'course' => $this->course->id,
        'lesson' => $lesson2->id,
    ]));

    $response->assertSessionHas('error');
    $this->assertDatabaseMissing('lesson_completions', [
        'user_id' => $student->id,
        'lesson_id' => $lesson2->id,
    ]);

    // Now complete lesson 1 first
    $response1 = $this->actingAs($student)->post(route('student.courses.lessons.toggle-complete', [
        'course' => $this->course->id,
        'lesson' => $lesson1->id,
    ]));

    $response1->assertSessionHas('success');
    $this->assertDatabaseHas('lesson_completions', [
        'user_id' => $student->id,
        'lesson_id' => $lesson1->id,
    ]);

    // Now lesson 2 can be completed
    $response2 = $this->actingAs($student)->post(route('student.courses.lessons.toggle-complete', [
        'course' => $this->course->id,
        'lesson' => $lesson2->id,
    ]));

    $response2->assertSessionHas('success');
    $this->assertDatabaseHas('lesson_completions', [
        'user_id' => $student->id,
        'lesson_id' => $lesson2->id,
    ]);
});

test('course classroom page returns unlockedLessonIds sequentially', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Module 1',
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

    $lesson3 = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 3',
        'sort_order' => 3,
    ]);

    // When none completed, only lesson1 is unlocked
    $response = $this->actingAs($student)->get(route('student.courses.learn', $this->course->id));
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Courses/Learn')
        ->where('unlockedLessonIds', [$lesson1->id])
    );

    // Complete lesson 1
    $student->completedLessons()->attach($lesson1->id, ['completed_at' => now()]);

    // Now lesson 1 and lesson 2 are unlocked, lesson 3 is locked
    $response2 = $this->actingAs($student)->get(route('student.courses.learn', $this->course->id));
    $response2->assertInertia(fn ($page) => $page
        ->component('Student/Courses/Learn')
        ->where('unlockedLessonIds', [$lesson1->id, $lesson2->id])
    );
});

test('admin can upload a video file for a lesson with local storage fallback when ImageKit is not configured', function () {
    config()->set('services.imagekit.private_key', null);
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $videoFile = UploadedFile::fake()->create('lecture.mp4', 2048, 'video/mp4');

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $this->course->id), [
        'module_name' => 'Module 1: Setup',
        'title' => 'Installing Environment',
        'video_file' => $videoFile,
        'duration' => '10:00',
    ]);

    $response->assertRedirect();

    $lesson = CourseLesson::where('title', 'Installing Environment')->first();
    expect($lesson)->not->toBeNull();

    $this->assertDatabaseHas('lesson_videos', [
        'lesson_id' => $lesson->id,
        'video_provider' => 'local',
        'duration_seconds' => 600,
    ]);

    $video = $lesson->videos()->first();
    expect($video->storage_key)->not->toBeNull();
    Storage::disk('public')->assertExists($video->storage_key);
});

test('admin can upload a video file directly via ImageKit service when configured', function () {
    config()->set('services.imagekit.private_key', 'test_private_key');

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->andReturn([
            'fileId' => 'ik_video_file_999',
            'url' => 'https://ik.imagekit.io/test/courses/videos/lecture.mp4',
            'name' => 'lecture.mp4',
            'size' => 4096,
        ]);
    $this->app->instance(ImageKitService::class, $mockImageKit);

    $admin = User::factory()->create(['role' => 'admin']);
    $videoFile = UploadedFile::fake()->create('lecture.mp4', 4096, 'video/mp4');

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $this->course->id), [
        'module_name' => 'Module 1: Setup',
        'title' => 'Advanced Deployment',
        'video_file' => $videoFile,
        'duration' => '15:30',
    ]);

    $response->assertRedirect();

    $lesson = CourseLesson::where('title', 'Advanced Deployment')->first();
    expect($lesson)->not->toBeNull();

    $this->assertDatabaseHas('lesson_videos', [
        'lesson_id' => $lesson->id,
        'video_url' => 'https://ik.imagekit.io/test/courses/videos/lecture.mp4?tr=orig',
        'storage_key' => 'ik_video_file_999',
        'video_provider' => 'imagekit',
        'duration_seconds' => 930,
    ]);
});

test('admin video upload fails validation for unsupported file types or excessive size', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    // Unsupported file type
    $invalidFile = UploadedFile::fake()->create('not-a-video.txt', 500, 'text/plain');
    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $this->course->id), [
        'module_name' => 'Module 1: Setup',
        'title' => 'Bad Video File',
        'video_file' => $invalidFile,
    ]);
    $response->assertSessionHasErrors(['video_file']);

    // Exceeding 100MB (102400 KB)
    $oversizedFile = UploadedFile::fake()->create('huge-video.mp4', 102401, 'video/mp4');
    $response2 = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $this->course->id), [
        'module_name' => 'Module 1: Setup',
        'title' => 'Oversized Video File',
        'video_file' => $oversizedFile,
    ]);
    $response2->assertSessionHasErrors(['video_file']);
});

test('updating a lesson with a new video deletes the old uploaded video', function () {
    config()->set('services.imagekit.private_key', 'test_private_key');

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('deleteFile')
        ->with('old_ik_file_123')
        ->once()
        ->andReturn(true);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->andReturn([
            'fileId' => 'new_ik_file_456',
            'url' => 'https://ik.imagekit.io/test/courses/videos/new_lecture.mp4',
            'name' => 'new_lecture.mp4',
            'size' => 3072,
        ]);
    $this->app->instance(ImageKitService::class, $mockImageKit);

    $admin = User::factory()->create(['role' => 'admin']);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Initial Lesson',
        'sort_order' => 1,
    ]);

    $lesson->videos()->create([
        'title' => 'Initial Lesson',
        'video_url' => 'https://ik.imagekit.io/test/courses/videos/old.mp4',
        'storage_key' => 'old_ik_file_123',
        'duration_seconds' => 300,
        'video_provider' => 'imagekit',
        'status' => 'ready',
    ]);

    $newVideoFile = UploadedFile::fake()->create('new_lecture.mp4', 3072, 'video/mp4');

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.update', [$this->course->id, $lesson->id]), [
        'module_name' => 'Module 1',
        'title' => 'Initial Lesson (Updated)',
        'video_file' => $newVideoFile,
        'duration' => '05:00',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('lesson_videos', [
        'lesson_id' => $lesson->id,
        'storage_key' => 'new_ik_file_456',
        'video_url' => 'https://ik.imagekit.io/test/courses/videos/new_lecture.mp4?tr=orig',
    ]);
});

test('lesson creation with video dispatches UploadLessonVideo background job and marks video processing', function () {
    Queue::fake();

    $admin = User::factory()->create(['role' => 'admin']);
    $videoFile = UploadedFile::fake()->create('lecture.mp4', 5000, 'video/mp4');

    $response = $this->actingAs($admin)->post(route('admin.courses.lessons.store', $this->course->id), [
        'module_name' => 'Module 1',
        'title' => 'Queued Video Lecture',
        'video_file' => $videoFile,
    ]);

    $response->assertRedirect();

    $lesson = CourseLesson::where('title', 'Queued Video Lecture')->first();
    expect($lesson)->not->toBeNull();

    $video = $lesson->videos()->first();
    expect($video)->not->toBeNull();
    expect($video->status)->toBe('processing');

    Queue::assertPushed(UploadLessonVideo::class, function (UploadLessonVideo $job) use ($video) {
        return $job->lessonVideo->id === $video->id;
    });
});

test('upload lesson video job marks video as failed and cleans up temp file on exception', function () {
    Storage::fake('local');
    Storage::fake('public');

    config()->set('services.imagekit.private_key', 'test_private_key');

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->andThrow(new RuntimeException('ImageKit network connection timeout'));

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Failing Job Lecture',
        'sort_order' => 1,
    ]);

    $video = $lesson->videos()->create([
        'title' => 'Failing Job Lecture',
        'video_url' => '',
        'status' => 'processing',
    ]);

    $tempPath = 'temp-videos/dummy.mp4';
    Storage::disk('local')->put($tempPath, 'dummy video content');

    $job = new UploadLessonVideo($video, $tempPath);

    try {
        $job->handle($mockImageKit);
    } catch (RuntimeException $e) {
        expect($e->getMessage())->toBe('ImageKit network connection timeout');
    }

    $video->refresh();
    expect($video->status)->toBe('failed');
    Storage::disk('local')->assertMissing($tempPath);
});
