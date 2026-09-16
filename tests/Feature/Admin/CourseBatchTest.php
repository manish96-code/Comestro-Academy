<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\User;

test('admin can create a live course with batches', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'Backend Engineering',
        'slug' => 'backend-engineering',
        'status' => 'active',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
        'title' => 'Live Full-Stack Cohort 2026',
        'category_id' => $category->id,
        'price' => 7999,
        'status' => 'published',
        'type' => 'live',
        'batches' => [
            [
                'batch_name' => 'Morning Batch',
                'time_slot' => '09:00 AM - 10:00 AM',
                'days' => 'Monday - Friday',
                'capacity' => 30,
                'is_active' => true,
            ],
            [
                'batch_name' => 'Afternoon Batch',
                'time_slot' => '02:00 PM - 03:00 PM',
                'days' => 'Monday - Friday',
                'capacity' => 30,
                'is_active' => true,
            ],
        ],
    ]);

    $response->assertRedirect(route('admin.courses.index'));

    $course = Course::where('slug', 'live-full-stack-cohort-2026')->first();
    expect($course)->not->toBeNull();
    expect($course->type)->toBe('live');
    expect($course->batches)->toHaveCount(2);

    $this->assertDatabaseHas('course_batches', [
        'course_id' => $course->id,
        'batch_name' => 'Morning Batch',
        'time_slot' => '09:00 AM - 10:00 AM',
    ]);

    $this->assertDatabaseHas('course_batches', [
        'course_id' => $course->id,
        'batch_name' => 'Afternoon Batch',
        'time_slot' => '02:00 PM - 03:00 PM',
    ]);
});

test('admin cannot create a live course without batches', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'DevOps',
        'slug' => 'devops',
        'status' => 'active',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.courses.store'), [
        'title' => 'Invalid Live Cohort',
        'category_id' => $category->id,
        'price' => 4999,
        'status' => 'published',
        'type' => 'live',
        'batches' => [],
    ]);

    $response->assertSessionHasErrors(['batches']);
    $this->assertDatabaseMissing('courses', [
        'title' => 'Invalid Live Cohort',
    ]);
});

test('admin can update batches on an existing live course', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create([
        'name' => 'Mobile Development',
        'slug' => 'mobile-development',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Flutter & iOS Masterclass',
        'slug' => 'flutter-ios-masterclass',
        'price' => 5999,
        'status' => 'published',
        'type' => 'live',
    ]);

    $batch1 = $course->batches()->create([
        'batch_name' => 'Batch 1',
        'time_slot' => '09:00 AM - 10:00 AM',
        'days' => 'Mon - Fri',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.courses.update', $course->id), [
        'title' => 'Flutter & iOS Masterclass',
        'category_id' => $category->id,
        'price' => 5999,
        'status' => 'published',
        'type' => 'live',
        'batches' => [
            [
                'id' => $batch1->id,
                'batch_name' => 'Updated Morning Batch',
                'time_slot' => '09:00 AM - 10:30 AM',
                'days' => 'Mon - Thu',
                'is_active' => true,
            ],
            [
                'batch_name' => 'New Evening Batch',
                'time_slot' => '07:00 PM - 08:00 PM',
                'days' => 'Monday - Friday',
                'is_active' => true,
            ],
        ],
    ]);

    $response->assertRedirect(route('admin.courses.index'));

    $batch1->refresh();
    expect($batch1->batch_name)->toBe('Updated Morning Batch');
    expect($batch1->time_slot)->toBe('09:00 AM - 10:30 AM');

    $this->assertDatabaseHas('course_batches', [
        'course_id' => $course->id,
        'batch_name' => 'New Evening Batch',
        'time_slot' => '07:00 PM - 08:00 PM',
    ]);
});
