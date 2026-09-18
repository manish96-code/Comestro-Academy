<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Models\CourseAssignment;
use App\Services\ImageKitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CourseAssignmentController extends Controller
{
    // Central Assignments Hub for Student
    public function index(Request $request): Response
    {
        $user = Auth::user();

        // Enrolled course IDs
        $enrolledCourseIds = $user->enrollments()
            ->where('status', 'active')
            ->pluck('course_id')
            ->toArray();

        $assignments = CourseAssignment::query()
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('is_published', true)
            ->with([
                'course:id,title,slug',
                'creator:id,name',
                'submissions' => fn ($q) => $q->where('user_id', $user->id),
            ])
            ->orderBy('due_date')
            ->get()
            ->map(function ($assignment) {
                $submission = $assignment->submissions->first();
                $status = 'pending';
                if ($submission) {
                    $status = $submission->status; // 'submitted', 'reviewed', 'resubmit'
                } elseif ($assignment->isOverdue()) {
                    $status = 'overdue';
                }

                return [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'total_marks' => $assignment->total_marks,
                    'passing_marks' => $assignment->passing_marks,
                    'due_date' => $assignment->due_date?->toISOString(),
                    'is_overdue' => $assignment->isOverdue(),
                    'course' => $assignment->course,
                    'creator' => $assignment->creator,
                    'submission' => $submission,
                    'status' => $status,
                ];
            });

        $stats = [
            'total' => $assignments->count(),
            'pending' => $assignments->whereIn('status', ['pending', 'overdue', 'resubmit'])->count(),
            'under_review' => $assignments->where('status', 'submitted')->count(),
            'graded' => $assignments->where('status', 'reviewed')->count(),
        ];

        return Inertia::render('Student/Assignments/Index', [
            'assignments' => $assignments,
            'stats' => $stats,
        ]);
    }

    // View Assignment details & submission portal
    public function show(CourseAssignment $assignment): Response
    {
        $user = Auth::user();

        // Check course enrollment
        $isEnrolled = $user->enrollments()
            ->where('course_id', $assignment->course_id)
            ->where('status', 'active')
            ->exists();

        if (! $isEnrolled && ! $user->is_admin) {
            abort(403, 'You must be enrolled in this course to view its assignments.');
        }

        $assignment->load(['course:id,title,slug', 'creator:id,name,email']);

        $submission = $assignment->submissions()
            ->where('user_id', $user->id)
            ->with('reviewer:id,name')
            ->first();

        return Inertia::render('Student/Assignments/Show', [
            'assignment' => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'description' => $assignment->description,
                'total_marks' => $assignment->total_marks,
                'passing_marks' => $assignment->passing_marks,
                'due_date' => $assignment->due_date?->toISOString(),
                'is_overdue' => $assignment->isOverdue(),
                'attachment_path' => $assignment->attachment_path ? (Str::startsWith($assignment->attachment_path, ['http://', 'https://']) ? $assignment->attachment_path : Storage::url($assignment->attachment_path)) : null,
                'course' => $assignment->course,
                'creator' => $assignment->creator,
            ],
            'submission' => $submission ? [
                'id' => $submission->id,
                'submission_text' => $submission->submission_text,
                'file_url' => $submission->file_path ? (Str::startsWith($submission->file_path, ['http://', 'https://']) ? $submission->file_path : Storage::url($submission->file_path)) : null,
                'file_name' => $submission->file_name,
                'github_url' => $submission->github_url,
                'submitted_at' => $submission->submitted_at?->format('d M Y, h:i A'),
                'is_late' => $submission->is_late,
                'status' => $submission->status,
                'marks_obtained' => $submission->marks_obtained,
                'is_passed' => $submission->is_passed,
                'feedback' => $submission->feedback,
                'reviewer' => $submission->reviewer,
                'reviewed_at' => $submission->reviewed_at?->format('d M Y, h:i A'),
            ] : null,
        ]);
    }

    // Submit or resubmit an assignment
    public function submit(Request $request, CourseAssignment $assignment, ImageKitService $imageKit): RedirectResponse
    {
        $user = Auth::user();

        // Check course enrollment
        $isEnrolled = $user->enrollments()
            ->where('course_id', $assignment->course_id)
            ->where('status', 'active')
            ->exists();

        if (! $isEnrolled && ! $user->is_admin) {
            abort(403, 'You must be enrolled in this course to submit assignments.');
        }

        // Student submissions strictly only accept PDF files or GitHub URLs
        $request->validate([
            'pdf_file' => 'nullable|file|mimes:pdf|max:20480',
            'github_url' => ['nullable', 'url', 'regex:/github\.com/i'],
            'submission_text' => 'nullable|string',
        ], [
            'pdf_file.mimes' => 'Only PDF (.pdf) files are accepted for assignment submission.',
            'github_url.regex' => 'The repository link must be a valid GitHub URL (e.g., https://github.com/username/project).',
        ]);

        $existing = AssignmentSubmission::where('course_assignment_id', $assignment->id)
            ->where('user_id', $user->id)
            ->first();

        // Ensure at least one submission item is provided
        if (! $request->hasFile('pdf_file') && empty($request->github_url) && ! $existing?->file_path && ! $existing?->github_url) {
            return back()->withErrors([
                'pdf_file' => 'Please attach your solution PDF file or provide your GitHub repository URL.',
            ]);
        }

        $filePath = $existing?->file_path;
        $fileName = $existing?->file_name;

        if ($request->hasFile('pdf_file')) {
            // Delete old file if stored locally
            if ($existing?->file_path && ! Str::startsWith($existing->file_path, ['http://', 'https://']) && Storage::disk('public')->exists($existing->file_path)) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $file = $request->file('pdf_file');
            $fileName = $file->getClientOriginalName();

            try {
                $upload = $imageKit->upload($file, '/assignments/submissions');
                $filePath = $upload['url'];
            } catch (Throwable $e) {
                return back()->withErrors(['pdf_file' => 'PDF upload failed: '.$e->getMessage()])->withInput();
            }
        }

        // Automatically determine if submitted after due date
        $isLate = $assignment->due_date !== null && now()->greaterThan($assignment->due_date);

        AssignmentSubmission::updateOrCreate(
            [
                'course_assignment_id' => $assignment->id,
                'user_id' => $user->id,
            ],
            [
                'submission_text' => $request->submission_text,
                'github_url' => $request->github_url,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'submitted_at' => now(),
                'is_late' => $isLate,
                'status' => 'submitted',
            ]
        );

        $msg = $isLate
            ? 'Assignment submitted successfully (marked as submitted after due date).'
            : 'Assignment submitted successfully!';

        return back()->with('success', $msg);
    }
}
