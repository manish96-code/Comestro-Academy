<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\User;

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
