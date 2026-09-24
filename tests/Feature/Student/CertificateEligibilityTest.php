<?php

use App\Models\AssignmentSubmission;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\CourseExam;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\ExamSubmission;
use App\Models\User;

test('student cannot claim certificate if they are not actively enrolled', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);

    $response = $this->actingAs($student)->post(route('student.courses.claim-certificate', $course->id));

    $response->assertRedirect();
    $response->assertSessionHas('error');
    expect(Certificate::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeFalse();
});

test('student cannot claim certificate if course lessons are not 100% completed', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
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

    // Student only completes lesson 1
    $student->completedLessons()->attach($lesson1->id, ['completed_at' => now()]);

    $response = $this->actingAs($student)->post(route('student.courses.claim-certificate', $course->id));

    $response->assertRedirect();
    $response->assertSessionHas('error');
    expect(Certificate::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeFalse();
});

test('student cannot claim certificate if a published exam is not passed', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);
    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);
    $student->completedLessons()->attach($lesson->id, ['completed_at' => now()]);

    // Published exam exists with no passing submission
    $exam = CourseExam::create([
        'course_id' => $course->id,
        'created_by' => $student->id,
        'title' => 'Midterm Exam',
        'duration_minutes' => 30,
        'marks_per_question' => 1,
        'passing_percentage' => 70,
        'is_published' => true,
    ]);

    // Student took exam but failed (score 50%)
    ExamSubmission::create([
        'course_exam_id' => $exam->id,
        'user_id' => $student->id,
        'started_at' => now(),
        'submitted_at' => now(),
        'score' => 5,
        'total_marks' => 10,
        'percentage' => 50,
        'is_passed' => false,
        'status' => 'failed',
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.claim-certificate', $course->id));

    $response->assertRedirect();
    $response->assertSessionHas('error');
    expect(Certificate::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeFalse();
});

test('student cannot claim certificate if a published assignment is not submitted or failed', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);
    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);
    $student->completedLessons()->attach($lesson->id, ['completed_at' => now()]);

    // Assignment exists
    $assignment = CourseAssignment::create([
        'course_id' => $course->id,
        'created_by' => $student->id,
        'title' => 'Capstone Project',
        'description' => 'Comprehensive capstone project assignment description',
        'total_marks' => 100,
        'passing_marks' => 60,
        'is_published' => true,
    ]);

    // Student submission failed (marks 45 < 60)
    AssignmentSubmission::create([
        'course_assignment_id' => $assignment->id,
        'user_id' => $student->id,
        'submission_text' => 'My project submission',
        'submitted_at' => now(),
        'status' => 'reviewed',
        'marks_obtained' => 45,
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.claim-certificate', $course->id));

    $response->assertRedirect();
    $response->assertSessionHas('error');
    expect(Certificate::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeFalse();
});

test('student successfully claims certificate when 100% lessons, all exams passed, and all assignments passed', function () {
    $student = User::factory()->create(['name' => 'Alice Smith', 'role' => 'student']);
    $course = Course::factory()->create(['title' => 'Full-Stack React & Laravel', 'status' => 'published']);
    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    // Complete all lessons
    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);
    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);
    $student->completedLessons()->attach($lesson->id, ['completed_at' => now()]);

    // Pass exam
    $exam = CourseExam::create([
        'course_id' => $course->id,
        'created_by' => $student->id,
        'title' => 'Final Exam',
        'duration_minutes' => 60,
        'marks_per_question' => 1,
        'passing_percentage' => 70,
        'is_published' => true,
    ]);
    ExamSubmission::create([
        'course_exam_id' => $exam->id,
        'user_id' => $student->id,
        'started_at' => now(),
        'submitted_at' => now(),
        'score' => 9,
        'total_marks' => 10,
        'percentage' => 90,
        'is_passed' => true,
        'status' => 'passed',
    ]);

    // Pass assignment
    $assignment = CourseAssignment::create([
        'course_id' => $course->id,
        'created_by' => $student->id,
        'title' => 'Production Capstone',
        'description' => 'Comprehensive capstone project assignment description',
        'total_marks' => 100,
        'passing_marks' => 60,
        'is_published' => true,
    ]);
    AssignmentSubmission::create([
        'course_assignment_id' => $assignment->id,
        'user_id' => $student->id,
        'submission_text' => 'My fullstack capstone repo',
        'submitted_at' => now(),
        'status' => 'reviewed',
        'marks_obtained' => 95,
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.claim-certificate', $course->id));

    $certificate = Certificate::where('user_id', $student->id)->where('course_id', $course->id)->first();
    expect($certificate)->not->toBeNull();
    expect($certificate->certificate_number)->toStartWith('CA-');
    expect($certificate->metadata['student_name'])->toBe('Alice Smith');
    expect($certificate->metadata['course_title'])->toBe('Full-Stack React & Laravel');
    expect($certificate->status)->toBe('active');

    $response->assertRedirect(route('student.certificates.show', $certificate->id));
});

test('certificate issuance is idempotent and does not create duplicates', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);
    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);
    $student->completedLessons()->attach($lesson->id, ['completed_at' => now()]);

    // Claim 1
    $this->actingAs($student)->post(route('student.courses.claim-certificate', $course->id));
    $firstCert = Certificate::where('user_id', $student->id)->where('course_id', $course->id)->first();

    // Claim 2
    $response = $this->actingAs($student)->post(route('student.courses.claim-certificate', $course->id));
    $response->assertRedirect(route('student.certificates.show', $firstCert->id));

    expect(Certificate::where('user_id', $student->id)->where('course_id', $course->id)->count())->toBe(1);
});

test('certificates are auto-generated when eligible student views certificates index or enrolled courses', function () {
    $student = User::factory()->create(['role' => 'student', 'name' => 'Auto Student']);
    $course = Course::factory()->create(['status' => 'published']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);
    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);
    $student->completedLessons()->attach($lesson->id, ['completed_at' => now()]);

    expect(Certificate::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeFalse();

    // Visiting enrolled courses auto-issues the certificate
    $response = $this->actingAs($student)->get(route('student.courses.enrolled'));
    $response->assertOk();

    $cert = Certificate::where('user_id', $student->id)->where('course_id', $course->id)->first();
    expect($cert)->not->toBeNull();
    expect($cert->status)->toBe('active');

    // Visiting certificates index shows it
    $responseIndex = $this->actingAs($student)->get(route('student.certificates.index'));
    $responseIndex->assertOk();
});

test('certificate is auto-generated when student passes final exam for 100% completed course', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['status' => 'published']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    $module = CourseModule::create([
        'course_id' => $course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);
    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);
    $student->completedLessons()->attach($lesson->id, ['completed_at' => now()]);

    $exam = CourseExam::create([
        'course_id' => $course->id,
        'title' => 'Final Exam',
        'duration_minutes' => 30,
        'marks_per_question' => 5,
        'passing_percentage' => 50,
        'is_published' => true,
    ]);

    $question = $exam->questions()->create([
        'question_text' => 'What is Laravel?',
        'question_type' => 'single_choice',
        'marks' => 5,
        'sort_order' => 1,
    ]);

    $option = $question->options()->create([
        'option_text' => 'PHP Framework',
        'is_correct' => true,
        'sort_order' => 1,
    ]);

    expect(Certificate::where('user_id', $student->id)->where('course_id', $course->id)->exists())->toBeFalse();

    $this->actingAs($student)->post(route('student.exams.submit', $exam->id), [
        'answers' => [
            $question->id => $option->id,
        ],
    ]);

    $cert = Certificate::where('user_id', $student->id)->where('course_id', $course->id)->first();
    expect($cert)->not->toBeNull();
    expect($cert->status)->toBe('active');
});
