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

        $validated['sort_order'] = $validated['sort_order'] ?? (($course->exams()->max('sort_order') ?? 0) + 1);

        $exam = $course->exams()->create($validated);

        return redirect()->route('admin.exams.show', $exam->id)->with('success', 'Exam created successfully.');
    }

    // Display Course Exam Management & Builder
    public function show(CourseExam $exam): Response
    {
        $exam->load([
            'course:id,title,slug,course_type,status',
            'questions' => fn ($q) => $q->orderBy('sort_order')->with([
                'options' => fn ($oq) => $oq->orderBy('sort_order'),
            ]),
            'submissions' => fn ($sq) => $sq->with('user:id,name,email')->latest(),
        ]);

        return Inertia::render('Admin/Courses/Exam', [
            'course' => $exam->course,
            'exam' => $exam,
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
        $courseId = $exam->course_id;
        $exam->delete();

        return redirect()->route('admin.exams.index', ['course_id' => $courseId])->with('success', 'Exam deleted successfully.');
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
}
