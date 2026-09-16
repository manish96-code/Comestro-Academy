<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseExamController extends Controller
{
    // Display the course exam / attempt portal
    public function show(Request $request, Course $course): Response|RedirectResponse
    {
        $user = $request->user();

        // 1. Check enrollment
        $isEnrolled = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if (! $isEnrolled && ! $user->isAdmin() && ! $user->isInstructor()) {
            return redirect()->route('courses.show', $course->slug)->with('error', 'Please enroll in this course to access the exam.');
        }

        // 2. Check if course has a published exam
        $exam = $course->exam()
            ->where('is_published', true)
            ->with([
                'questions' => fn ($q) => $q->orderBy('sort_order')->with([
                    'options' => fn ($oq) => $oq->orderBy('sort_order'),
                ]),
            ])
            ->first();

        if (! $exam) {
            return redirect()->route('student.courses.learn', $course->id)->with('error', 'No published exam is currently available for this course.');
        }

        // 3. Verify 100% course completion
        $progress = $course->getProgressFor($user);
        $isAdminOrInstructor = $user->isAdmin() || $user->isInstructor();

        if (! $progress['is_completed'] && ! $isAdminOrInstructor) {
            return redirect()->route('student.courses.learn', [
                'course' => $course->id,
                'tab' => 'exam',
            ])->with('error', 'You must complete 100% of the course lectures before attempting the final exam.');
        }

        // 4. Check if student has already submitted (single attempt only)
        $submission = ExamSubmission::where('course_exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->first();

        // If not submitted, sanitize questions so students cannot inspect correct answers in the browser network tab
        $sanitizedQuestions = [];
        if (! $submission) {
            $sanitizedQuestions = $exam->questions->map(function ($q) {
                return [
                    'id' => $q->id,
                    'question_text' => $q->question_text,
                    'question_type' => $q->question_type,
                    'points' => $q->points,
                    'sort_order' => $q->sort_order,
                    'options' => $q->options->map(fn ($o) => [
                        'id' => $o->id,
                        'option_text' => $o->option_text,
                        'sort_order' => $o->sort_order,
                    ]),
                ];
            });
        } else {
            // If already submitted, include review with correct answers & explanations
            $sanitizedQuestions = $exam->questions->map(function ($q) {
                return [
                    'id' => $q->id,
                    'question_text' => $q->question_text,
                    'question_type' => $q->question_type,
                    'points' => $q->points,
                    'explanation' => $q->explanation,
                    'sort_order' => $q->sort_order,
                    'options' => $q->options->map(fn ($o) => [
                        'id' => $o->id,
                        'option_text' => $o->option_text,
                        'is_correct' => $o->is_correct,
                        'sort_order' => $o->sort_order,
                    ]),
                ];
            });
        }

        return Inertia::render('Student/Courses/ExamAttempt', [
            'course' => $course->only(['id', 'title', 'slug']),
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'duration_minutes' => $exam->duration_minutes,
                'passing_percentage' => $exam->passing_percentage,
                'total_questions' => $exam->questions->count(),
            ],
            'questions' => $sanitizedQuestions,
            'submission' => $submission,
            'progress' => $progress,
        ]);
    }

    // Evaluate and record the student's single exam submission
    public function submit(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();

        // 1. Check enrollment
        $isEnrolled = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if (! $isEnrolled && ! $user->isAdmin() && ! $user->isInstructor()) {
            return redirect()->route('courses.show', $course->slug)->with('error', 'Please enroll in this course to submit the exam.');
        }

        // 2. Check 100% course completion
        $progress = $course->getProgressFor($user);
        if (! $progress['is_completed'] && ! $user->isAdmin() && ! $user->isInstructor()) {
            return redirect()->route('student.courses.learn', $course->id)->with('error', 'You must complete 100% of the course lectures before attempting the final exam.');
        }

        // 3. Load exam with questions and options
        $exam = $course->exam()
            ->where('is_published', true)
            ->with([
                'questions.options',
            ])
            ->firstOrFail();

        // 4. Enforce Single Attempt: Check if already submitted
        $existing = ExamSubmission::where('course_exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return redirect()->route('student.courses.exam.show', $course->id)
                ->with('error', 'You have already submitted this exam. Only one attempt is permitted.');
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'started_at' => ['nullable', 'date'],
        ]);

        $submittedAnswers = $validated['answers'];
        $totalPoints = 0;
        $earnedScore = 0;

        foreach ($exam->questions as $question) {
            $totalPoints += $question->points;
            $correctOptionIds = $question->options->where('is_correct', true)->pluck('id')->sort()->values()->toArray();

            $userSelected = isset($submittedAnswers[$question->id])
                ? (is_array($submittedAnswers[$question->id]) ? $submittedAnswers[$question->id] : [$submittedAnswers[$question->id]])
                : [];
            $userSelected = collect($userSelected)->map(fn ($id) => (int) $id)->sort()->values()->toArray();

            // Compare selected options against correct options
            if ($userSelected === $correctOptionIds && ! empty($correctOptionIds)) {
                $earnedScore += $question->points;
            }
        }

        $percentage = $totalPoints > 0 ? (int) round(($earnedScore / $totalPoints) * 100) : 0;
        $isPassed = $percentage >= $exam->passing_percentage;

        ExamSubmission::create([
            'course_exam_id' => $exam->id,
            'user_id' => $user->id,
            'started_at' => $validated['started_at'] ?? now(),
            'submitted_at' => now(),
            'score' => $earnedScore,
            'total_points' => $totalPoints,
            'percentage' => $percentage,
            'is_passed' => $isPassed,
            'answers' => $submittedAnswers,
            'status' => 'completed',
        ]);

        $message = $isPassed
            ? "Congratulations! You passed the exam with {$percentage}% score."
            : "Exam submitted. You scored {$percentage}%. Passing score is {$exam->passing_percentage}%.";

        return redirect()->route('student.courses.exam.show', $course->id)
            ->with($isPassed ? 'success' : 'error', $message);
    }
}
