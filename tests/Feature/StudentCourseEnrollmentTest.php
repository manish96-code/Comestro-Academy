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

test('guest can view published courses catalog without login', function () {
    $category = Category::create([
        'name' => 'Backend Development',
        'slug' => 'backend-development',
        'status' => 'active',
    ]);

    Course::create([
        'category_id' => $category->id,
        'title' => 'Mastering Laravel APIs',
        'slug' => 'mastering-laravel-apis',
        'price' => 3999,
        'status' => 'published',
    ]);

    Course::create([
        'category_id' => $category->id,
        'title' => 'Draft API Course',
        'slug' => 'draft-api-course',
        'price' => 1999,
        'status' => 'draft',
    ]);

    $response = $this->get(route('courses.index'));

    $response->assertOk();
    $response->assertSee('Mastering Laravel APIs');
    $response->assertDontSee('Draft API Course');
});

test('guest can also access courses via student courses url without login', function () {
    $response = $this->get(route('student.courses.index'));

    $response->assertOk();
});

test('guest is redirected to login when attempting to enroll in a course', function () {
    $category = Category::create([
        'name' => 'DevOps',
        'slug' => 'devops-category',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Docker & Kubernetes Mastery',
        'slug' => 'docker-kubernetes-mastery',
        'price' => 4999,
        'status' => 'published',
    ]);

    $response = $this->post(route('courses.enroll', $course->id));

    $response->assertRedirect(route('login'));
    $this->assertEquals(0, Enrollment::count());
});

test('guest can view published course detail page by slug without login', function () {
    $category = Category::create([
        'name' => 'Mobile App Development',
        'slug' => 'mobile-app-development',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Flutter & Dart Cross-Platform Pro',
        'slug' => 'flutter-dart-cross-platform-pro',
        'description' => 'Build iOS and Android applications with single codebase.',
        'price' => 3999,
        'discount_price' => 2499,
        'duration' => '10 Weeks',
        'status' => 'published',
    ]);

    $response = $this->get(route('courses.show', $course->slug));

    $response->assertOk();
    $response->assertSee('Flutter & Dart Cross-Platform Pro');
    $response->assertSee('Mobile App Development');
});

test('student can view course detail page and see enrolled status', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Data Engineering',
        'slug' => 'data-engineering',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Apache Spark & Big Data',
        'slug' => 'apache-spark-big-data',
        'price' => 5999,
        'status' => 'published',
    ]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($student)->get(route('courses.show', $course->slug));

    $response->assertOk();
    $response->assertSee('Apache Spark & Big Data');
});

test('guest cannot view draft course detail page', function () {
    $category = Category::create([
        'name' => 'Cybersecurity',
        'slug' => 'cybersecurity-cat',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Ethical Hacking 101',
        'slug' => 'ethical-hacking-101',
        'price' => 4999,
        'status' => 'draft',
    ]);

    $response = $this->get(route('courses.show', $course->slug));

    $response->assertNotFound();
});

test('admin can preview draft course detail page', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'AI Engineering',
        'slug' => 'ai-engineering-cat',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Deep Learning & LLM Fine Tuning',
        'slug' => 'deep-learning-llm-fine-tuning',
        'price' => 9999,
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin)->get(route('courses.show', $course->slug));

    $response->assertOk();
    $response->assertSee('Deep Learning & LLM Fine Tuning');
});
