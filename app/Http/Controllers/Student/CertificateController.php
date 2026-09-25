<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Services\CertificateService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    // List earned certificates
    public function index(Request $request, CertificateService $certificateService): Response
    {
        return Inertia::render('Student/Certificates/Index', [
            'earned' => $certificateService->getEarnedCertificates($request->user()),
        ]);
    }

    // View specific certificate
    public function show(Request $request, Certificate $certificate): Response
    {
        $user = $request->user();

        // Student can only view their own certificate; Admin/Instructor can view any
        if ($certificate->user_id !== $user->id && ! $user->isAdmin() && ! $user->isInstructor()) {
            abort(403, 'Unauthorized access to this certificate.');
        }

        $certificate->load(['course.category', 'user']);

        return Inertia::render('Student/Certificates/Show', [
            'certificate' => [
                'id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'uuid' => $certificate->uuid,
                'status' => $certificate->status,
                'issued_at' => $certificate->issued_at->format('F d, Y'),
                'final_score' => $certificate->final_score,
                'metadata' => $certificate->metadata,
                'student' => [
                    'name' => $certificate->metadata['student_name'] ?? $certificate->user?->name,
                    'email' => $certificate->metadata['student_email'] ?? $certificate->user?->email,
                ],
                'course' => [
                    'id' => $certificate->course_id,
                    'title' => $certificate->metadata['course_title'] ?? $certificate->course?->title,
                    'category' => $certificate->metadata['course_category'] ?? $certificate->course?->category?->name,
                    'duration' => $certificate->metadata['course_duration'] ?? $certificate->course?->duration,
                    'instructor_name' => $certificate->metadata['instructor_name'] ?? 'Comestro Faculty Team',
                ],
            ],
        ]);
    }

    // Claim / Generate certificate for a completed course
    public function claim(Request $request, Course $course, CertificateService $certificateService): RedirectResponse
    {
        try {
            $certificate = $certificateService->issueCertificate($request->user(), $course);

            return redirect()->route('student.certificates.show', $certificate->id)
                ->with('success', 'Congratulations! Your certificate of completion has been successfully issued.');
        } catch (DomainException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
