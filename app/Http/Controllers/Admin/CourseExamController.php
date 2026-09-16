<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamQuestion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseExamController extends Controller
{
    // Display all courses with their exam status
    public function index(Request $request): Response
    {
        $query = Course::query()->with([
            'category:id,name',
            'instructor.user:id,name',
            'exam' => fn ($q) => $q->withCount(['questions', 'submissions']),
        ]);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('exam', fn ($eq) => $eq->where('title', 'like', "%{$search}%"));
            });
        }

        $courses = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Exams/Index', [
            'courses' => $courses,
            'filters' => $request->only(['search']),
        ]);
    }

    // Display Course Exam Management & Builder
    public function show(Course $course): Response
    {
        $exam = $course->exam()
            ->with([
                'questions' => fn ($q) => $q->orderBy('sort_order')->with([
                    'options' => fn ($oq) => $oq->orderBy('sort_order'),
                ]),
                'submissions' => fn ($sq) => $sq->with('user:id,name,email')->latest(),
            ])
            ->first();

        return Inertia::render('Admin/Courses/Exam', [
            'course' => $course->only(['id', 'title', 'slug', 'course_type', 'status']),
            'exam' => $exam,
        ]);
    }

    // Save or update exam configuration
    public function saveSettings(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'duration_minutes' => ['required', 'integer', 'min:0', 'max:360'],
            'passing_percentage' => ['required', 'integer', 'min:1', 'max:100'],
            'is_published' => ['required', 'boolean'],
        ]);

        $course->exam()->updateOrCreate(
            ['course_id' => $course->id],
            $validated
        );

        return back()->with('success', 'Course exam settings saved successfully.');
    }

    // Store a new question with options
    public function storeQuestion(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'question_text' => ['required', 'string'],
            'question_type' => ['required', 'in:single_choice,multiple_choice,true_false'],
            'points' => ['required', 'integer', 'min:1', 'max:100'],
            'explanation' => ['nullable', 'string', 'max:2000'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.option_text' => ['required', 'string', 'max:1000'],
            'options.*.is_correct' => ['required', 'boolean'],
        ]);

        // Ensure course has an exam
        $exam = $course->exam()->firstOrCreate(
            ['course_id' => $course->id],
            [
                'title' => "Final Assessment: {$course->title}",
                'description' => 'Answer all questions carefully to earn your certification.',
                'duration_minutes' => 30,
                'passing_percentage' => 70,
                'is_published' => true,
            ]
        );

        // Calculate next sort order
        $nextOrder = ($exam->questions()->max('sort_order') ?? 0) + 1;

        $question = $exam->questions()->create([
            'question_text' => $validated['question_text'],
            'question_type' => $validated['question_type'],
            'points' => $validated['points'],
            'explanation' => $validated['explanation'] ?? null,
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
    public function deleteQuestion(Course $course, ExamQuestion $question): RedirectResponse
    {
        if ($question->course_exam_id !== $course->exam?->id) {
            abort(403, 'Unauthorized action.');
        }

        $question->delete();

        return back()->with('success', 'Exam question deleted successfully.');
    }
}
