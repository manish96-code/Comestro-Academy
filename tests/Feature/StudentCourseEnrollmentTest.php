<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;

test('student can view published courses catalog', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Full-Stack Development',
        'slug' => 'full-stack-development',
        'status' => 'active',
    ]);

    Course::create([
        'category_id' => $category->id,
        'title' => 'React & Node.js Bootcamp',
        'slug' => 'react-nodejs-bootcamp',
        'price' => 4999,
        'status' => 'published',
    ]);

    Course::create([
        'category_id' => $category->id,
        'title' => 'Unpublished Draft Course',
        'slug' => 'unpublished-draft-course',
        'price' => 1999,
        'status' => 'draft',
    ]);

    $response = $this->actingAs($student)->get(route('student.courses.index'));

    $response->assertOk();
    $response->assertSee('React & Node.js Bootcamp');
    $response->assertDontSee('Unpublished Draft Course');
});

test('student can enroll in a published course', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Cloud Computing',
        'slug' => 'cloud-computing',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'AWS Cloud Architect',
        'slug' => 'aws-cloud-architect',
        'price' => 3499,
        'status' => 'published',
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id));

    $response->assertRedirect();
    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);
});

test('student cannot enroll in a draft course', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'DevOps',
        'slug' => 'devops',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Docker Mastery In Progress',
        'slug' => 'docker-mastery-in-progress',
        'price' => 1500,
        'status' => 'draft',
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id));

    $response->assertRedirect();
    $this->assertDatabaseMissing('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
    ]);
});

test('student cannot enroll twice in the same course', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Data Science',
        'slug' => 'data-science',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Python Data Science',
        'slug' => 'python-data-science',
        'price' => 2999,
        'status' => 'published',
    ]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id));

    $response->assertRedirect();
    $this->assertEquals(1, Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->count());
});

test('student can view enrolled courses page', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $response = $this->actingAs($student)->get(route('student.courses.enrolled'));

    $response->assertOk();
});
