<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Http\UploadedFile;

test('admin can view courses list', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.courses.index'));

    $response->assertOk();
});

test('admin can create a new course', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'Backend Development',
        'slug' => 'backend-development',
        'status' => 'active',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
        'title' => 'Mastering Laravel 12',
        'category_id' => $category->id,
        'price' => 2999,
        'status' => 'published',
        'duration' => '10 Weeks',
    ]);

    $response->assertRedirect(route('admin.courses.index'));
    $this->assertDatabaseHas('courses', [
        'title' => 'Mastering Laravel 12',
        'slug' => 'mastering-laravel-12',
        'category_id' => $category->id,
    ]);
});

test('admin can update a course', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'Frontend Development',
        'slug' => 'frontend-development',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'React from Scratch',
        'slug' => 'react-from-scratch',
        'price' => 1999,
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.courses.update', $course->id), [
        'title' => 'React from Scratch 2026',
        'category_id' => $category->id,
        'price' => 2499,
        'status' => 'published',
    ]);

    $response->assertRedirect(route('admin.courses.index'));
    $this->assertDatabaseHas('courses', [
        'id' => $course->id,
        'title' => 'React from Scratch 2026',
        'status' => 'published',
    ]);
});

test('admin can save and update course_includes list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'Mobile Development',
        'slug' => 'mobile-development',
        'status' => 'active',
    ]);

    $includes = [
        '10 Weeks of intensive Flutter training',
        'Official Certificate of Completion',
        'Lifetime access to GitHub repos',
    ];

    $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
        'title' => 'Flutter & Dart Masterclass',
        'category_id' => $category->id,
        'price' => 3999,
        'status' => 'published',
        'course_includes' => $includes,
    ]);

    $response->assertRedirect(route('admin.courses.index'));

    $course = Course::where('slug', 'flutter-dart-masterclass')->first();
    expect($course)->not->toBeNull()
        ->and($course->course_includes)->toEqual($includes);

    // Update includes
    $updatedIncludes = [
        '12 Weeks of intensive Flutter training',
        'Direct 1-on-1 mentor guidance',
    ];

    $this->actingAs($admin)->patch(route('admin.courses.update', $course->id), [
        'title' => 'Flutter & Dart Masterclass',
        'category_id' => $category->id,
        'price' => 3999,
        'status' => 'published',
        'course_includes' => $updatedIncludes,
    ]);

    $course->refresh();
    expect($course->course_includes)->toEqual($updatedIncludes);
});

test('admin can upload thumbnail image via imagekit when creating course', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'Design',
        'slug' => 'design',
        'status' => 'active',
    ]);

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->andReturn([
            'url' => 'https://ik.imagekit.io/man96/courses/banner.jpg',
            'fileId' => 'file_12345',
            'name' => 'banner.jpg',
        ]);
    $this->app->instance(ImageKitService::class, $mockImageKit);

    $file = UploadedFile::fake()->image('banner.jpg');

    $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
        'title' => 'UI/UX Design Masterclass',
        'category_id' => $category->id,
        'price' => 4999,
        'status' => 'published',
        'thumbnail_image' => $file,
        'course_includes' => ['Certificate of Completion', 'Source code access'],
        'curriculum' => [
            ['title' => 'Figma Basics', 'subtitle' => 'Interface and shortcuts'],
        ],
    ]);

    $response->assertRedirect(route('admin.courses.index'));
    $this->assertDatabaseHas('courses', [
        'title' => 'UI/UX Design Masterclass',
        'thumbnail' => 'https://ik.imagekit.io/man96/courses/banner.jpg',
    ]);

    $course = Course::where('slug', 'uiux-design-masterclass')->first();
    expect($course)->not->toBeNull()
        ->and($course->course_includes)->toEqual(['Certificate of Completion', 'Source code access'])
        ->and($course->curriculum)->toEqual([
            ['title' => 'Figma Basics', 'subtitle' => 'Interface and shortcuts'],
        ]);
});

test('admin can save curriculum with multiple subtitles array', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'Backend Engineering',
        'slug' => 'backend-engineering',
        'status' => 'active',
    ]);

    $curriculum = [
        [
            'title' => 'Advanced Database Architecture',
            'subtitles' => [
                'Indexing Strategies & EXPLAIN analysis',
                'Partitioning & Sharding at scale',
                'Transactions, ACID & Locking mechanisms',
            ],
            'subtitle' => 'Indexing Strategies & EXPLAIN analysis, Partitioning & Sharding at scale, Transactions, ACID & Locking mechanisms',
        ],
    ];

    $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
        'title' => 'High-Performance SQL & Databases',
        'category_id' => $category->id,
        'price' => 3499,
        'status' => 'published',
        'curriculum' => $curriculum,
    ]);

    $response->assertRedirect(route('admin.courses.index'));

    $course = Course::where('slug', 'high-performance-sql-databases')->first();
    expect($course)->not->toBeNull()
        ->and($course->curriculum)->toEqual($curriculum);
});
