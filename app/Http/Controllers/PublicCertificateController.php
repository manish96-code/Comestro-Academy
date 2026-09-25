<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicCertificateController extends Controller
{
    /**
     * Public certificate verification page (Guest accessible).
     * Accepts optional pre-filled code via route parameter or query string.
     */
    public function show(Request $request, ?string $code = null): Response
    {
        $code = $code ?: $request->query('code', $request->query('certificate_number', ''));
        $name = $request->query('name', $request->query('student_name', ''));

        // If both code and name are present in query params, verify immediately
        if (! empty($code) && ! empty($name)) {
            return $this->performVerification($code, $name);
        }

        return Inertia::render('Certificates/Verify', [
            'searched' => false,
            'found' => false,
            'certificate' => null,
            'searched_code' => $code,
            'searched_name' => $name,
            'error_message' => null,
        ]);
    }

    /**
     * Process verification search request.
     */
    public function verify(Request $request): Response
    {
        $validated = $request->validate([
            'certificate_number' => 'required|string',
            'student_name' => 'required|string',
        ], [
            'certificate_number.required' => 'Please enter the Certificate Number.',
            'student_name.required' => 'Please enter the Student Full Name.',
        ]);

        return $this->performVerification(
            $validated['certificate_number'],
            $validated['student_name']
        );
    }

    /**
     * Core verification logic checking both Certificate Number and Student Name.
     */
    private function performVerification(string $code, string $name): Response
    {
        $normalizedCode = strtoupper(trim($code));
        $normalizedName = strtolower(trim($name));

        $certificate = Certificate::with(['course.category', 'user'])
            ->where(function ($query) use ($normalizedCode) {
                $query->where('certificate_number', $normalizedCode)
                    ->orWhere('uuid', $normalizedCode);
            })
            ->first();

        $searchedData = [
            'searched_code' => $code,
            'searched_name' => $name,
        ];

        if (! $certificate) {
            return Inertia::render('Certificates/Verify', array_merge($searchedData, [
                'searched' => true,
                'found' => false,
                'certificate' => null,
                'error_message' => "No certificate found with identifier '{$code}'. Please check the certificate number and try again.",
            ]));
        }

        // Compare Student Name
        $actualStudentName = $certificate->metadata['student_name'] ?? $certificate->user?->name ?? '';
        $normalizedActualName = strtolower(trim($actualStudentName));

        // Match exact or contains
        $nameMatches = ($normalizedActualName === $normalizedName)
            || str_contains($normalizedActualName, $normalizedName)
            || str_contains($normalizedName, $normalizedActualName);

        if (! $nameMatches) {
            return Inertia::render('Certificates/Verify', array_merge($searchedData, [
                'searched' => true,
                'found' => false,
                'certificate' => null,
                'error_message' => "The student name entered does not match the issued record for certificate '{$code}'.",
            ]));
        }

        return Inertia::render('Certificates/Verify', array_merge($searchedData, [
            'searched' => true,
            'found' => true,
            'error_message' => null,
            'certificate' => [
                'id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'status' => $certificate->status,
                'is_valid' => $certificate->isValid(),
                'issued_at' => $certificate->issued_at?->format('F d, Y'),
                'final_score' => $certificate->final_score,
                'student_name' => $actualStudentName,
                'course_title' => $certificate->metadata['course_title'] ?? $certificate->course?->title,
                'course_category' => $certificate->metadata['course_category'] ?? $certificate->course?->category?->name,
                'course_duration' => $certificate->metadata['course_duration'] ?? $certificate->course?->duration,
                'instructor_name' => $certificate->metadata['instructor_name'] ?? 'Comestro Faculty Team',
                'total_lessons' => $certificate->metadata['total_lessons'] ?? null,
                'exams_count' => $certificate->metadata['exams_count'] ?? null,
                'assignments_count' => $certificate->metadata['assignments_count'] ?? null,
            ],
        ]));
    }
}
