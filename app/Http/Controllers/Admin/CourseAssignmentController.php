<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Services\CertificateService;
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
    // Global Assignment Hub & Review Queue across all courses
    public function globalIndex(Request $request): Response
    {
        $query = CourseAssignment::query()
            ->with([
                'course:id,title,slug',
                'creator:id,name,email',
                'submissions' => fn ($q) => $q->with('student:id,name,email')->latest(),
            ])
            ->withCount([
                'submissions',
                'submissions as pending_count' => fn ($q) => $q->where('status', 'submitted'),
                'submissions as graded_count' => fn ($q) => $q->where('status', 'reviewed'),
            ]);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('course', fn ($cq) => $cq->where('title', 'like', "%{$search}%"));
            });
        }

        if ($request->course_id) {
            $query->where('course_id', $request->course_id);
        }

        $assignments = $query->latest()->paginate(10)->withQueryString();

        $stats = [
            'total_assignments' => CourseAssignment::count(),
            'pending_reviews' => AssignmentSubmission::where('status', 'submitted')->count(),
            'graded_submissions' => AssignmentSubmission::where('status', 'reviewed')->count(),
        ];

        $courses = Course::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('Admin/Assignments/Index', [
            'assignments' => $assignments,
            'courses' => $courses,
            'stats' => $stats,
            'filters' => $request->only(['search', 'course_id']),
        ]);
    }

    // Per-Course Assignment Manager & Gradebook
    public function index(Course $course): Response
    {
        $assignments = $course->assignments()
            ->with([
                'creator:id,name,email',
                'submissions' => fn ($q) => $q->with(['student:id,name,email', 'reviewer:id,name'])->latest(),
            ])
            ->withCount(['submissions'])
            ->get();

        return Inertia::render('Admin/Courses/Assignments', [
            'course' => $course->only(['id', 'title', 'slug', 'status']),
            'assignments' => $assignments,
        ]);
    }

    // Store a new assignment
    public function store(Request $request, Course $course, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'total_marks' => 'required|integer|min:1|max:1000',
            'passing_marks' => 'required|integer|min:1|max:1000',
            'due_date' => 'nullable|date',
            'is_published' => 'boolean',
            'attachment' => 'nullable|file|mimes:pdf,zip,doc,docx,png,jpg|max:20480',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            try {
                $upload = $imageKit->upload($request->file('attachment'), '/assignments/attachments');
                $attachmentPath = $upload['url'];
            } catch (Throwable $e) {
                return back()->withErrors(['attachment' => 'Attachment upload failed: '.$e->getMessage()])->withInput();
            }
        }

        $course->assignments()->create([
            'created_by' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'total_marks' => $validated['total_marks'],
            'passing_marks' => $validated['passing_marks'],
            'due_date' => $validated['due_date'] ?? null,
            'is_published' => $request->boolean('is_published', true),
            'attachment_path' => $attachmentPath,
        ]);

        return back()->with('success', 'Assignment created successfully.');
    }

    // Update assignment details
    public function update(Request $request, Course $course, CourseAssignment $assignment, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'total_marks' => 'required|integer|min:1|max:1000',
            'passing_marks' => 'required|integer|min:1|max:1000',
            'due_date' => 'nullable|date',
            'is_published' => 'boolean',
            'attachment' => 'nullable|file|mimes:pdf,zip,doc,docx,png,jpg|max:20480',
        ]);

        if ($request->hasFile('attachment')) {
            if ($assignment->attachment_path && ! Str::startsWith($assignment->attachment_path, ['http://', 'https://']) && Storage::disk('public')->exists($assignment->attachment_path)) {
                Storage::disk('public')->delete($assignment->attachment_path);
            }

            try {
                $upload = $imageKit->upload($request->file('attachment'), '/assignments/attachments');
                $assignment->attachment_path = $upload['url'];
            } catch (Throwable $e) {
                return back()->withErrors(['attachment' => 'Attachment upload failed: '.$e->getMessage()])->withInput();
            }
        }

        $assignment->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'total_marks' => $validated['total_marks'],
            'passing_marks' => $validated['passing_marks'],
            'due_date' => $validated['due_date'] ?? null,
            'is_published' => $request->boolean('is_published', true),
        ]);

        return back()->with('success', 'Assignment updated successfully.');
    }

    // Delete assignment
    public function destroy(Course $course, CourseAssignment $assignment): RedirectResponse
    {
        if ($assignment->attachment_path && ! Str::startsWith($assignment->attachment_path, ['http://', 'https://']) && Storage::disk('public')->exists($assignment->attachment_path)) {
            Storage::disk('public')->delete($assignment->attachment_path);
        }

        $assignment->delete();

        return back()->with('success', 'Assignment deleted successfully.');
    }

    // Grade and give feedback on a submission
    public function grade(Request $request, AssignmentSubmission $submission): RedirectResponse
    {
        $maxMarks = $submission->assignment->total_marks ?? 100;

        $validated = $request->validate([
            'marks_obtained' => "required|integer|min:0|max:{$maxMarks}",
            'feedback' => 'nullable|string',
        ], [
            'marks_obtained.required' => 'Please enter the marks awarded for this submission.',
        ]);

        $submission->update([
            'marks_obtained' => $validated['marks_obtained'],
            'status' => 'reviewed',
            'feedback' => $validated['feedback'] ?? null,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        $student = $submission->student ?? $submission->user;
        $course = $submission->assignment?->course;
        if ($student && $course) {
            $certificateService = app(CertificateService::class);
            if ($certificateService->checkEligibility($student, $course)['eligible']) {
                try {
                    $certificateService->issueCertificate($student, $course);
                } catch (Throwable) {
                    // ignore
                }
            }
        }

        return back()->with('success', 'Assignment evaluated and graded successfully.');
    }

    // Revoke a submission (delete from DB so student can resubmit)
    public function revokeSubmission(AssignmentSubmission $submission, ImageKitService $imageKit): RedirectResponse
    {
        if ($submission->file_path) {
            if (! Str::startsWith($submission->file_path, ['http://', 'https://']) && Storage::disk('public')->exists($submission->file_path)) {
                Storage::disk('public')->delete($submission->file_path);
            } else {
                try {
                    $imageKit->deleteFile($submission->file_path);
                } catch (Throwable) {
                    // ignore
                }
            }
        }

        $submission->delete();

        return back()->with('success', 'Assignment submission revoked and deleted successfully. The student can now submit a fresh assignment.');
    }
}
