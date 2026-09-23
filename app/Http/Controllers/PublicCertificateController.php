<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicCertificateController extends Controller
{
    // Public certificate verification page
    public function verify(Request $request, string $code): Response
    {
        $normalizedCode = trim($code);

        $certificate = Certificate::with(['course.category', 'user'])
            ->where('certificate_number', $normalizedCode)
            ->orWhere('uuid', $normalizedCode)
            ->first();

        if (! $certificate) {
            return Inertia::render('Certificates/Verify', [
                'found' => false,
                'searched_code' => $normalizedCode,
                'certificate' => null,
            ]);
        }

        return Inertia::render('Certificates/Verify', [
            'found' => true,
            'searched_code' => $normalizedCode,
            'certificate' => [
                'id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'status' => $certificate->status,
                'is_valid' => $certificate->isValid(),
                'issued_at' => $certificate->issued_at->format('F d, Y'),
                'final_score' => $certificate->final_score,
                'student_name' => $certificate->metadata['student_name'] ?? $certificate->user?->name,
                'course_title' => $certificate->metadata['course_title'] ?? $certificate->course?->title,
                'course_category' => $certificate->metadata['course_category'] ?? $certificate->course?->category?->name,
                'course_duration' => $certificate->metadata['course_duration'] ?? $certificate->course?->duration,
                'instructor_name' => $certificate->metadata['instructor_name'] ?? 'Comestro Faculty Team',
                'total_lessons' => $certificate->metadata['total_lessons'] ?? null,
                'exams_count' => $certificate->metadata['exams_count'] ?? null,
                'assignments_count' => $certificate->metadata['assignments_count'] ?? null,
            ],
        ]);
    }
}
