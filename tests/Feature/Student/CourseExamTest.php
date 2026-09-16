<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseExam;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\ExamQuestion;
use App\Models\ExamSubmission;
use App\Models\User;

beforeEach(function () {
    $this->category = Category::create([
        'name' => 'Web Development',
        'slug' => 'web-development',
        'is_active' => true,
    ]);

    $this->course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Fullstack Mastery',
        'slug' => 'fullstack-mastery',
        'price' => 199,
        'discount_price' => 99,
        'status' => 'published',
    ]);
});

test('admin can view all course exams listing', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.exams.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Exams/Index')
        ->has('courses.data')
    );
});

test('admin can create and update exam settings', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.courses.exam.save', $this->course->id), [
        'title' => 'Certification Exam',
        'description' => 'Test your knowledge',
        'duration_minutes' => 45,
        'marks_per_question' => 2,
        'passing_percentage' => 75,
        'is_published' => true,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('course_exams', [
        'course_id' => $this->course->id,
        'title' => 'Certification Exam',
        'duration_minutes' => 45,
        'marks_per_question' => 2,
        'passing_percentage' => 75,
    ]);
});

test('admin can add question with options and delete it', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.courses.exam.questions.store', $this->course->id), [
        'question_text' => 'What is React?',
        'options' => [
            ['option_text' => 'A UI Library', 'is_correct' => true],
            ['option_text' => 'A Database', 'is_correct' => false],
        ],
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('exam_questions', [
        'question_text' => 'What is React?',
    ]);

    $question = ExamQuestion::where('question_text', 'What is React?')->first();
    expect($question->options)->toHaveCount(2);

    // Delete question
    $delResponse = $this->actingAs($admin)->delete(route('admin.courses.exam.questions.destroy', [
        'course' => $this->course->id,
        'question' => $question->id,
    ]));

    $delResponse->assertSessionHas('success');
    $this->assertDatabaseMissing('exam_questions', ['id' => $question->id]);
});

test('student cannot access exam if course progress is under 100%', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);

    CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);

    // Create exam
    CourseExam::create([
        'course_id' => $this->course->id,
        'title' => 'Final Exam',
        'duration_minutes' => 30,
        'passing_percentage' => 70,
        'is_published' => true,
    ]);

    // Student has not completed Lesson 1 (0% completed)
    $response = $this->actingAs($student)->get(route('student.courses.exam.show', $this->course->id));

    // Must redirect with error message
    $response->assertRedirect(route('student.courses.learn', [
        'course' => $this->course->id,
        'tab' => 'exam',
    ]));
    $response->assertSessionHas('error');
});

test('student with 100% course completion can access exam', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
        'title' => 'Module 1',
        'sort_order' => 1,
    ]);

    $lesson = CourseLesson::create([
        'module_id' => $module->id,
        'title' => 'Lesson 1',
        'sort_order' => 1,
    ]);

    // Student completes the lesson
    $student->completedLessons()->attach($lesson->id, ['completed_at' => now()]);

    // Create exam with 1 question
    $exam = CourseExam::create([
        'course_id' => $this->course->id,
        'title' => 'Final Exam',
        'duration_minutes' => 30,
        'passing_percentage' => 70,
        'is_published' => true,
    ]);

    $question = $exam->questions()->create([
        'question_text' => 'Sample Question',
        'question_type' => 'single_choice',
        'marks' => 1,
        'sort_order' => 1,
    ]);

    $opt = $question->options()->create([
        'option_text' => 'Correct Answer',
        'is_correct' => true,
        'sort_order' => 1,
    ]);

    $response = $this->actingAs($student)->get(route('student.courses.exam.show', $this->course->id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Courses/ExamAttempt')
        ->where('exam.title', 'Final Exam')
        ->where('questions.0.options.0.option_text', 'Correct Answer')
        // Ensure is_correct is hidden from student in taking mode
        ->missing('questions.0.options.0.is_correct')
    );
});

test('student can submit exam once and score is graded accurately', function () {
    $student = User::factory()->create(['role' => 'student']);

    $this->course->enrollments()->create([
        'user_id' => $student->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $module = CourseModule::create([
        'course_id' => $this->course->id,
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
        'course_id' => $this->course->id,
        'title' => 'Final Exam',
        'duration_minutes' => 30,
        'passing_percentage' => 50,
        'is_published' => true,
    ]);

    $q1 = $exam->questions()->create([
        'question_text' => 'Question 1',
        'question_type' => 'single_choice',
        'marks' => 5,
        'sort_order' => 1,
    ]);
    $q1Correct = $q1->options()->create(['option_text' => 'Correct 1', 'is_correct' => true]);
    $q1Wrong = $q1->options()->create(['option_text' => 'Wrong 1', 'is_correct' => false]);

    $q2 = $exam->questions()->create([
        'question_text' => 'Question 2',
        'question_type' => 'single_choice',
        'marks' => 5,
        'sort_order' => 2,
    ]);
    $q2Correct = $q2->options()->create(['option_text' => 'Correct 2', 'is_correct' => true]);
    $q2Wrong = $q2->options()->create(['option_text' => 'Wrong 2', 'is_correct' => false]);

    // Submit: answer Q1 correctly and Q2 incorrectly (5/10 marks = 50% => Passed!)
    $response = $this->actingAs($student)->post(route('student.courses.exam.submit', $this->course->id), [
        'answers' => [
            $q1->id => [$q1Correct->id],
            $q2->id => [$q2Wrong->id],
        ],
    ]);

    $response->assertRedirect(route('student.courses.exam.show', $this->course->id));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('exam_submissions', [
        'course_exam_id' => $exam->id,
        'user_id' => $student->id,
        'score' => 5,
        'total_marks' => 10,
        'percentage' => 50,
        'is_passed' => true,
    ]);

    // Attempting a second submission must be blocked (single attempt only)
    $secondAttempt = $this->actingAs($student)->post(route('student.courses.exam.submit', $this->course->id), [
        'answers' => [
            $q1->id => [$q1Correct->id],
            $q2->id => [$q2Correct->id],
        ],
    ]);

    $secondAttempt->assertSessionHas('error');
    expect(ExamSubmission::where('user_id', $student->id)->count())->toBe(1);
});
