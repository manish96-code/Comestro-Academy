<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    // List all issued certificates with metrics and filtering
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $courseId = $request->query('course_id');
        $status = $request->query('status'); // all, active, revoked

        $query = Certificate::with(['user:id,name,email', 'course:id,title,slug']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('course', function ($cq) use ($search) {
                        $cq->where('title', 'like', "%{$search}%");
                    });
            });
        }

        if ($courseId) {
            $query->where('course_id', $courseId);
        }

        if ($status && in_array($status, ['active', 'revoked'], true)) {
            $query->where('status', $status);
        }

        $certificates = $query->latest('issued_at')->paginate(15)->withQueryString();

        $stats = [
            'total_issued' => Certificate::count(),
            'active_valid' => Certificate::where('status', 'active')->count(),
            'revoked' => Certificate::where('status', 'revoked')->count(),
            'unique_graduates' => Certificate::distinct('user_id')->count('user_id'),
        ];

        $courses = Course::orderBy('title')->get(['id', 'title']);

        return Inertia::render('Admin/Certificates/Index', [
            'certificates' => $certificates,
            'stats' => $stats,
            'courses' => $courses,
            'filters' => [
                'search' => $search ?? '',
                'course_id' => $courseId ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    // Toggle active / revoked status
    public function toggleStatus(Certificate $certificate): RedirectResponse
    {
        $newStatus = $certificate->status === 'active' ? 'revoked' : 'active';
        $certificate->update(['status' => $newStatus]);

        $message = $newStatus === 'active'
            ? "Certificate {$certificate->certificate_number} has been restored and is active."
            : "Certificate {$certificate->certificate_number} has been revoked.";

        return back()->with('success', $message);
    }
}
