<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseExam;
use App\Models\ExamQuestion;
use App\Models\ExamSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseExamController extends Controller
{
    // Global directory of all exams across courses
    public function index(Request $request): Response
    {
        $query = CourseExam::query()->with([
            'course:id,title,slug,thumbnail,category_id',
            'course.category:id,name',
            'creator:id,name,email',
        ])->withCount(['questions', 'submissions']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('course', fn ($cq) => $cq->where('title', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $exams = $query->orderBy('course_id')->orderBy('sort_order')->orderBy('id')->paginate(12)->withQueryString();

        $courses = Course::query()->select('id', 'title')->orderBy('title')->get();

        $stats = [
            'total_exams' => CourseExam::count(),
            'published_exams' => CourseExam::where('is_published', true)->count(),
            'total_questions' => ExamQuestion::count(),
            'total_submissions' => ExamSubmission::count(),
        ];

        return Inertia::render('Admin/Exams/Index', [
            'exams' => $exams,
            'courses' => $courses,
            'stats' => $stats,
            'filters' => $request->only(['search', 'course_id']),
        ]);
    }

    // View exams for a specific course
    public function courseExams(Course $course): RedirectResponse
    {
        return redirect()->route('admin.exams.index', ['course_id' => $course->id]);
    }

    // Create a new exam for a course
    public function store(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'duration_minutes' => ['required', 'integer', 'min:0', 'max:360'],
            'marks_per_question' => ['required', 'integer', 'min:1', 'max:50'],
            'passing_percentage' => ['required', 'integer', 'min:1', 'max:100'],
            'is_published' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $validated['created_by'] = $request->user()?->id;
        $validated['sort_order'] = $validated['sort_order'] ?? (($course->exams()->max('sort_order') ?? 0) + 1);

        $exam = $course->exams()->create($validated);

        return redirect()->route('admin.exams.show', $exam->id)->with('success', 'Exam created successfully.');
    }

    // Display Course Exam Management & Builder
    public function show(Request $request, CourseExam $exam): Response
    {
        $exam->load([
            'course:id,title,slug,type,status',
            'creator:id,name,email',
            'questions' => fn ($q) => $q->orderBy('sort_order')->with([
                'options' => fn ($oq) => $oq->orderBy('sort_order'),
            ]),
            'submissions' => fn ($sq) => $sq->with('user:id,name,email')->latest(),
        ]);

        return Inertia::render('Admin/Courses/Exam', [
            'course' => $exam->course,
            'exam' => $exam,
            'initialTab' => $request->query('tab', 'questions'),
        ]);
    }

    // Save or update exam configuration
    public function saveSettings(Request $request, CourseExam $exam): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'duration_minutes' => ['required', 'integer', 'min:0', 'max:360'],
            'marks_per_question' => ['required', 'integer', 'min:1', 'max:50'],
            'passing_percentage' => ['required', 'integer', 'min:1', 'max:100'],
            'is_published' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $exam->update($validated);

        // Keep all questions marks in sync with exam marks_per_question
        $exam->questions()->update(['marks' => $validated['marks_per_question']]);

        return back()->with('success', 'Course exam settings saved successfully.');
    }

    // Delete an exam
    public function destroy(CourseExam $exam): RedirectResponse
    {
        $exam->delete();

        return back()->with('success', 'Exam deleted successfully.');
    }

    // Store a new question with options
    public function storeQuestion(Request $request, CourseExam $exam): RedirectResponse
    {
        $validated = $request->validate([
            'question_text' => ['required', 'string'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.option_text' => ['required', 'string', 'max:1000'],
            'options.*.is_correct' => ['required', 'boolean'],
        ]);

        $nextOrder = ($exam->questions()->max('sort_order') ?? 0) + 1;

        $question = $exam->questions()->create([
            'question_text' => $validated['question_text'],
            'question_type' => 'single_choice',
            'marks' => $exam->marks_per_question ?? 1,
            'explanation' => null,
            'sort_order' => $nextOrder,
        ]);

        foreach ($validated['options'] as $idx => $opt) {
            $question->options()->create([
                'option_text' => $opt['option_text'],
                'is_correct' => (bool) $opt['is_correct'],
                'sort_order' => $idx + 1,
            ]);
        }

        return back()->with('success', 'Exam question added successfully.');
    }

    // Delete an exam question
    public function deleteQuestion(CourseExam $exam, ExamQuestion $question): RedirectResponse
    {
        if ($question->course_exam_id !== $exam->id) {
            abort(403, 'Unauthorized action.');
        }

        $question->delete();

        return back()->with('success', 'Exam question deleted successfully.');
    }

    // Display individual student's exam submission review
    public function showSubmission(CourseExam $exam, ExamSubmission $submission): Response
    {
        if ($submission->course_exam_id !== $exam->id) {
            abort(404);
        }

        $exam->load([
            'course:id,title,slug',
            'questions' => fn ($q) => $q->orderBy('sort_order')->with([
                'options' => fn ($oq) => $oq->orderBy('sort_order'),
            ]),
        ]);

        $submission->load('user:id,name,email');

        $marksPerQ = $exam->marks_per_question ?? 1;
        $totalMarks = $exam->questions->sum(fn ($q) => $q->marks ?: $marksPerQ) ?: ($exam->questions->count() * $marksPerQ);

        return Inertia::render('Admin/Exams/Submission', [
            'course' => $exam->course,
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'duration_minutes' => $exam->duration_minutes,
                'marks_per_question' => $marksPerQ,
                'passing_percentage' => $exam->passing_percentage,
                'total_marks' => $totalMarks,
            ],
            'questions' => $exam->questions->map(function ($q) {
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
            }),
            'submission' => [
                'id' => $submission->id,
                'score' => $submission->score,
                'total_marks' => $submission->total_marks,
                'percentage' => $submission->percentage,
                'is_passed' => $submission->is_passed,
                'answers' => $submission->answers,
                'submitted_at' => $submission->submitted_at?->format('M d, Y h:i A'),
                'user' => $submission->user,
            ],
        ]);
    }
}
