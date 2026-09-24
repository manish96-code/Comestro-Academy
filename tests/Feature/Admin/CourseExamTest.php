<?php

use App\Models\Course;
use App\Models\CourseExam;
use App\Models\Enrollment;
use App\Models\ExamSubmission;
use App\Models\User;

test('admin can remove exam submission record so student can retake exam', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $exam = CourseExam::create([
        'course_id' => $course->id,
        'title' => 'Web Dev Exam',
        'duration_minutes' => 30,
        'marks_per_question' => 2,
        'passing_percentage' => 70,
        'is_published' => true,
    ]);

    $submission = ExamSubmission::create([
        'course_exam_id' => $exam->id,
        'user_id' => $student->id,
        'score' => 0,
        'total_marks' => 6,
        'percentage' => 0,
        'is_passed' => false,
        'answers' => [],
        'submitted_at' => now(),
    ]);

    expect(ExamSubmission::count())->toBe(1);

    $response = $this->actingAs($admin)->delete(route('admin.exams.submissions.destroy', [
        'exam' => $exam->id,
        'submission' => $submission->id,
    ]));

    $response->assertRedirect(route('admin.exams.show', ['exam' => $exam->id, 'tab' => 'submissions']));
    $response->assertSessionHas('success');

    expect(ExamSubmission::where('id', $submission->id)->exists())->toBeFalse();
    expect(ExamSubmission::where('course_exam_id', $exam->id)->where('user_id', $student->id)->exists())->toBeFalse();
});

test('non-admin student cannot delete exam submission', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);

    $exam = CourseExam::create([
        'course_id' => $course->id,
        'title' => 'Web Dev Exam',
        'duration_minutes' => 30,
        'marks_per_question' => 2,
        'passing_percentage' => 70,
        'is_published' => true,
    ]);

    $submission = ExamSubmission::create([
        'course_exam_id' => $exam->id,
        'user_id' => $student->id,
        'score' => 0,
        'total_marks' => 6,
        'percentage' => 0,
        'is_passed' => false,
        'answers' => [],
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($student)->delete(route('admin.exams.submissions.destroy', [
        'exam' => $exam->id,
        'submission' => $submission->id,
    ]));

    $response->assertRedirect(route('student.dashboard'));
    expect(ExamSubmission::where('id', $submission->id)->exists())->toBeTrue();
});
