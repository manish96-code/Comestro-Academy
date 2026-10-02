<?php

use App\Models\AssignmentSubmission;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\Enrollment;
use App\Models\User;

beforeEach(function () {
    $this->category = Category::create([
        'name' => 'Web Development',
        'slug' => 'web-development',
        'status' => 'active',
    ]);

    $this->course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Fullstack Mastery',
        'slug' => 'fullstack-mastery',
        'price' => 1999,
        'status' => 'published',
    ]);

    $this->assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'Capstone Project',
        'description' => 'Build a full stack application.',
        'total_marks' => 100,
        'passing_marks' => 50,
    ]);

    $this->student = User::factory()->create(['role' => 'student']);
    Enrollment::create([
        'user_id' => $this->student->id,
        'course_id' => $this->course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $this->admin = User::factory()->create(['role' => 'admin']);
});

test('admin can view global assignments dashboard', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.assignments.index'));
    $response->assertOk();
});

test('admin can view course assignments page', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.courses.assignments.index', $this->course->id));
    $response->assertOk();
});

test('admin can grade a student submission', function () {
    $submission = AssignmentSubmission::create([
        'course_assignment_id' => $this->assignment->id,
        'user_id' => $this->student->id,
        'github_url' => 'https://github.com/student/capstone',
        'status' => 'submitted',
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->post(route('admin.assignments.submissions.grade', $submission->id), [
        'marks_obtained' => 85,
        'feedback' => 'Excellent work on the project architecture!',
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('assignment_submissions', [
        'id' => $submission->id,
        'status' => 'reviewed',
        'marks_obtained' => 85,
        'feedback' => 'Excellent work on the project architecture!',
    ]);
});

test('admin can revoke a student submission which permanently deletes it from database', function () {
    $submission = AssignmentSubmission::create([
        'course_assignment_id' => $this->assignment->id,
        'user_id' => $this->student->id,
        'github_url' => 'https://github.com/student/capstone',
        'status' => 'submitted',
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->delete(route('admin.assignments.submissions.revoke', $submission->id));

    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('assignment_submissions', [
        'id' => $submission->id,
    ]);
});
