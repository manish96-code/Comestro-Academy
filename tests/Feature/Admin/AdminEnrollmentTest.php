<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;

test('admin can view student profile with enrolled courses', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);

    $category = Category::create([
        'name' => 'Web Dev',
        'slug' => 'web-dev-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course '.uniqid(),
        'slug' => 'test-course-'.uniqid(),
        'price' => 1999,
        'status' => 'published',
    ]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.students.show', $student->id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Students/Show')
        ->has('enrollments', 1)
        ->where('enrollments.0.course.id', $course->id)
    );
});

test('admin can enroll a student into a course', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);

    $category = Category::create([
        'name' => 'Web Dev',
        'slug' => 'web-dev-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course '.uniqid(),
        'slug' => 'test-course-'.uniqid(),
        'price' => 1999,
        'status' => 'published',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.students.enrollments.store', $student->id), [
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);
});

test('admin can update enrollment status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);

    $category = Category::create([
        'name' => 'Web Dev',
        'slug' => 'web-dev-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course '.uniqid(),
        'slug' => 'test-course-'.uniqid(),
        'price' => 1999,
        'status' => 'published',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.enrollments.update', $enrollment->id), [
        'status' => 'completed',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('enrollments', [
        'id' => $enrollment->id,
        'status' => 'completed',
    ]);
});

test('admin can remove a student course enrollment', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);

    $category = Category::create([
        'name' => 'Web Dev',
        'slug' => 'web-dev-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course '.uniqid(),
        'slug' => 'test-course-'.uniqid(),
        'price' => 1999,
        'status' => 'published',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($admin)->delete(route('admin.enrollments.destroy', $enrollment->id));

    $response->assertRedirect();
    $this->assertDatabaseMissing('enrollments', [
        'id' => $enrollment->id,
    ]);
});

test('admin can view courses with enrolled students and enrollments count', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);

    $category = Category::create([
        'name' => 'Web Dev',
        'slug' => 'web-dev-'.uniqid(),
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Test Course '.uniqid(),
        'slug' => 'test-course-'.uniqid(),
        'price' => 1999,
        'status' => 'published',
    ]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.courses.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Courses/Index')
        ->has('courses.data')
        ->has('students')
        ->where('courses.data.0.enrollments_count', 1)
        ->has('courses.data.0.enrollments', 1)
    );
});
