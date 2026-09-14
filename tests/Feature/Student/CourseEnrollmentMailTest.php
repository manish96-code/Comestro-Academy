<?php

use App\Mail\CourseEnrollmentMail;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('student enrollment queues CourseEnrollmentMail to the student', function () {
    Mail::fake();

    $student = User::factory()->create([
        'name' => 'rahul sharma',
        'email' => 'rahul.test@example.com',
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Web Development',
        'slug' => 'web-dev-test',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Full-Stack Laravel & React Mastery',
        'slug' => 'fullstack-laravel-react-mastery-mail-test',
        'price' => 0,
        'status' => 'published',
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id));

    $response->assertSessionHas('success');

    Mail::assertQueued(CourseEnrollmentMail::class, function (CourseEnrollmentMail $mail) use ($course) {
        return $mail->hasTo('rahul.test@example.com')
            && $mail->studentName === 'Rahul Sharma'
            && $mail->enrollment->course_id === $course->id;
    });
});

test('CourseEnrollmentMail renders capitalized student name and classroom link', function () {
    $student = User::factory()->create([
        'name' => 'priya mehta',
        'email' => 'priya.test@example.com',
        'role' => 'student',
    ]);

    $category = Category::create([
        'name' => 'Design',
        'slug' => 'design-mail-test',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'UI/UX Prototyping Systems',
        'slug' => 'ui-ux-prototyping-systems-mail-test',
        'price' => 0,
        'status' => 'published',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $mailable = new CourseEnrollmentMail($enrollment);

    expect($mailable->studentName)->toBe('Priya Mehta');

    $rendered = $mailable->render();

    expect($rendered)->toContain('Priya Mehta')
        ->toContain('UI/UX Prototyping Systems')
        ->toContain('Go to Classroom')
        ->toContain(url('/student/courses/ui-ux-prototyping-systems-mail-test/learn'));
});
