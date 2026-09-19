<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseExam;
use App\Models\ExamSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseExamController extends Controller
{
    // Display all available exams for the student's enrolled courses
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Retrieve active enrolled courses with published exams
        $enrollments = $user->enrollments()
            ->where('status', 'active')
            ->with([
                'course.category',
                'course.exams' => function ($q) {
                    $q->where('is_published', true)->withCount('questions')->orderBy('sort_order')->orderBy('id');
                },
            ])
            ->get();

        $examsData = [];
        $totalExams = 0;
        $passedExams = 0;
        $readyExams = 0;
        $lockedExams = 0;

        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            if (! $course || $course->exams->isEmpty()) {
                continue;
            }

            $progress = $course->getProgressFor($user);

            foreach ($course->exams as $exam) {
                $submission = ExamSubmission::where('course_exam_id', $exam->id)
                    ->where('user_id', $user->id)
                    ->first();

                $status = 'locked';
                if ($submission) {
                    $status = $submission->is_passed ? 'passed' : 'failed';
                    if ($submission->is_passed) {
                        $passedExams++;
                    }
                } elseif ($progress['is_completed']) {
                    $status = 'ready';
                    $readyExams++;
                } else {
                    $status = 'locked';
                    $lockedExams++;
                }

                $totalExams++;

                $marksPerQ = $exam->marks_per_question ?? 1;
                $totalMarks = ($exam->questions_count ?? 0) * $marksPerQ;

                $examsData[] = [
                    'course' => [
                        'id' => $course->id,
                        'title' => $course->title,
                        'slug' => $course->slug,
                        'thumbnail' => $course->thumbnail,
                        'category' => $course->category?->only(['id', 'name', 'color']),
                    ],
                    'exam' => [
                        'id' => $exam->id,
                        'title' => $exam->title,
                        'description' => $exam->description,
                        'duration_minutes' => $exam->duration_minutes,
                        'marks_per_question' => $marksPerQ,
                        'passing_percentage' => $exam->passing_percentage,
                        'questions_count' => $exam->questions_count,
                        'total_marks' => $totalMarks,
                        'sort_order' => $exam->sort_order,
                    ],
                    'progress' => [
                        'completed_lessons' => $progress['completed_lessons'],
                        'total_lessons' => $progress['total_lessons'],
                        'progress_percentage' => $progress['progress_percentage'],
                        'is_completed' => $progress['is_completed'],
                    ],
                    'submission' => $submission ? [
                        'id' => $submission->id,
                        'score' => $submission->score,
                        'total_marks' => $submission->total_marks,
                        'percentage' => $submission->percentage,
                        'is_passed' => $submission->is_passed,
                        'submitted_at' => $submission->submitted_at?->format('M d, Y h:i A'),
                    ] : null,
                    'status' => $status,
                ];
            }
        }

        return Inertia::render('Student/Exams/Index', [
            'exams' => $examsData,
            'stats' => [
                'total' => $totalExams,
                'passed' => $passedExams,
                'ready' => $readyExams,
                'locked' => $lockedExams,
            ],
        ]);
    }

    // Display the course exam / attempt portal
    public function show(Request $request, CourseExam $exam): Response|RedirectResponse
    {
        $user = $request->user();
        $course = $exam->course;

        if (! $course) {
            abort(404);
        }

        // 1. Check enrollment
        $isEnrolled = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if (! $isEnrolled && ! $user->isAdmin() && ! $user->isInstructor()) {
            return redirect()->route('courses.show', $course->slug)->with('error', 'Please enroll in this course to access the exam.');
        }

        // 2. Check if published
        if (! $exam->is_published) {
            return redirect()->route('student.courses.learn', $course->id)->with('error', 'This exam is currently not published.');
        }

        // Load questions with options
        $exam->load([
            'questions' => fn ($q) => $q->orderBy('sort_order')->with([
                'options' => fn ($oq) => $oq->orderBy('sort_order'),
            ]),
        ]);

        // 3. Verify 100% course completion
        $progress = $course->getProgressFor($user);
        $isAdminOrInstructor = $user->isAdmin() || $user->isInstructor();

        if (! $progress['is_completed'] && ! $isAdminOrInstructor) {
            return redirect()->route('student.courses.learn', [
                'course' => $course->id,
                'tab' => 'exam',
            ])->with('error', 'You must complete 100% of the course lectures before attempting this exam.');
        }

        // 4. Check if student has already submitted (single attempt per exam)
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
                    'marks' => $q->marks,
                    'sort_order' => $q->sort_order,
                    'options' => $q->options->map(function ($opt) {
                        return [
                            'id' => $opt->id,
                            'option_text' => $opt->option_text,
                            'sort_order' => $opt->sort_order,
                        ];
                    }),
                ];
            });
        } else {
            // Include correct answers and explanations for completed submission review
            $sanitizedQuestions = $exam->questions->map(function ($q) {
                return [
                    'id' => $q->id,
                    'question_text' => $q->question_text,
                    'question_type' => $q->question_type,
                    'marks' => $q->marks,
                    'explanation' => $q->explanation,
                    'sort_order' => $q->sort_order,
                    'options' => $q->options->map(function ($opt) {
                        return [
                            'id' => $opt->id,
                            'option_text' => $opt->option_text,
                            'is_correct' => (bool) $opt->is_correct,
                            'sort_order' => $opt->sort_order,
                        ];
                    }),
                ];
            });
        }

        $marksPerQ = $exam->marks_per_question ?? 1;
        $totalMarks = $exam->questions->count() * $marksPerQ;

        return Inertia::render('Student/Courses/ExamAttempt', [
            'course' => $course->only(['id', 'title', 'slug']),
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'duration_minutes' => $exam->duration_minutes,
                'marks_per_question' => $marksPerQ,
                'passing_percentage' => $exam->passing_percentage,
                'total_marks' => $totalMarks,
            ],
            'questions' => $sanitizedQuestions,
            'submission' => $submission ? [
                'id' => $submission->id,
                'score' => $submission->score,
                'total_marks' => $submission->total_marks,
                'percentage' => $submission->percentage,
                'is_passed' => $submission->is_passed,
                'answers' => $submission->answers,
                'submitted_at' => $submission->submitted_at?->format('M d, Y h:i A'),
            ] : null,
            'progress' => $progress,
        ]);
    }

    // Submit answers for the course exam
    public function submit(Request $request, CourseExam $exam): RedirectResponse
    {
        $user = $request->user();
        $course = $exam->course;

        if (! $course) {
            abort(404);
        }

        // 1. Check enrollment
        $isEnrolled = $user->enrollments()
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if (! $isEnrolled && ! $user->isAdmin() && ! $user->isInstructor()) {
            return redirect()->route('courses.show', $course->slug)->with('error', 'Please enroll in this course to take the exam.');
        }

        // 2. Verify completion
        $progress = $course->getProgressFor($user);
        $isAdminOrInstructor = $user->isAdmin() || $user->isInstructor();

        if (! $progress['is_completed'] && ! $isAdminOrInstructor) {
            return redirect()->route('student.courses.learn', $course->id)->with('error', 'You must complete 100% of the lectures before submitting the exam.');
        }

        // 3. Prevent duplicate submission
        $existing = ExamSubmission::where('course_exam_id', $exam->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return redirect()->route('student.exams.show', $exam->id)->with('error', 'You have already attempted this exam.');
        }

        // 4. Validate submission input
        $validated = $request->validate([
            'answers' => ['nullable', 'array'],
            'started_at' => ['nullable', 'date'],
        ]);

        $submittedAnswers = $validated['answers'] ?? []; // [question_id => selected_option_id]

        // 5. Calculate Score
        $exam->load('questions.options');
        $marksPerQ = $exam->marks_per_question ?? 1;
        $totalQuestions = $exam->questions->count();
        $totalMarks = $exam->questions->sum(fn ($q) => $q->marks ?: $marksPerQ) ?: ($totalQuestions * $marksPerQ);
        $score = 0;

        foreach ($exam->questions as $question) {
            $selectedOptionId = $submittedAnswers[$question->id] ?? null;
            if (is_array($selectedOptionId)) {
                $selectedOptionId = $selectedOptionId[0] ?? null;
            }

            if ($selectedOptionId) {
                $correctOption = $question->options->firstWhere('is_correct', true);
                if ($correctOption && (int) $correctOption->id === (int) $selectedOptionId) {
                    $score += $question->marks ?: $marksPerQ;
                }
            }
        }

        $percentage = $totalMarks > 0 ? (int) round(($score / $totalMarks) * 100) : 0;
        $isPassed = $percentage >= $exam->passing_percentage;

        // 6. Save Submission
        ExamSubmission::create([
            'course_exam_id' => $exam->id,
            'user_id' => $user->id,
            'started_at' => $validated['started_at'] ?? now(),
            'submitted_at' => now(),
            'score' => $score,
            'total_marks' => $totalMarks,
            'percentage' => $percentage,
            'is_passed' => $isPassed,
            'answers' => $submittedAnswers,
            'status' => 'completed',
        ]);

        $statusMsg = $isPassed
            ? "Congratulations! You scored {$percentage}% ({$score}/{$totalMarks}) and passed this exam!"
            : "Exam submitted. You scored {$percentage}% ({$score}/{$totalMarks}). Passing percentage is {$exam->passing_percentage}%.";

        return redirect()->route('student.exams.show', $exam->id)->with('success', $statusMsg);
    }
}
