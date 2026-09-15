<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    /**
     * Display a listing of all course invoices for the authenticated student.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Retrieve student's enrollments with their persistent invoice snapshot
        $enrollments = $user->enrollments()
            ->with(['invoice', 'course.category'])
            ->latest('enrolled_at')
            ->paginate(10);

        $enrollments->through(function ($enrollment) {
            $invoice = $enrollment->invoice ?? Invoice::createSnapshot($enrollment);
            $courseDetails = $invoice->course_details ?? [];

            $enrollment->invoice_number = $invoice->invoice_number;
            $enrollment->paid_amount = (float) $invoice->amount;
            $enrollment->payment_method = $invoice->payment_method;
            $enrollment->payment_id = $invoice->transaction_id;
            $enrollment->currency = $invoice->currency;
            if (isset($courseDetails['title']) && $enrollment->course) {
                $enrollment->course->title = $courseDetails['title'];
            }

            return $enrollment;
        });

        // Summary statistics calculated directly from persistent invoices
        $totalSpent = Invoice::where('user_id', $user->id)
            ->where('status', 'PAID')
            ->sum('amount');

        $activeEnrollmentsCount = $user->enrollments()->where('status', 'active')->count();

        return Inertia::render('Student/Invoices/Index', [
            'enrollments' => $enrollments,
            'stats' => [
                'total_invoices' => $user->enrollments()->count(),
                'total_spent' => (float) $totalSpent,
                'active_enrollments' => $activeEnrollmentsCount,
            ],
        ]);
    }

    /**
     * Display the specified invoice for an enrollment from its frozen database snapshot.
     */
    public function show(Request $request, Enrollment $enrollment): Response
    {
        $user = $request->user();

        // Authorization check
        if ($enrollment->user_id !== $user->id && ! $user->isAdmin()) {
            abort(403, 'Unauthorized access to this course invoice.');
        }

        // Retrieve the immutable snapshot from the invoices table (or create once if missing)
        $invoiceRecord = Invoice::where('enrollment_id', $enrollment->id)->first()
            ?? Invoice::createSnapshot($enrollment);

        $studentDetails = $invoiceRecord->student_details ?? [];
        $courseDetails = $invoiceRecord->course_details ?? [];
        $issuedDate = $invoiceRecord->paid_at ?? $invoiceRecord->created_at;

        $invoice = [
            'id' => $enrollment->id,
            'invoice_number' => $invoiceRecord->invoice_number,
            'date' => $issuedDate->format('d M, Y'),
            'time' => $issuedDate->format('h:i A'),
            'status' => $invoiceRecord->status,
            'payment_method' => $invoiceRecord->payment_method,
            'transaction_id' => $invoiceRecord->transaction_id ?? 'FREE-ADM-'.str_pad((string) $enrollment->id, 6, '0', STR_PAD_LEFT),
            'order_id' => $invoiceRecord->order_id,
            'amount' => (float) $invoiceRecord->amount,
            'currency' => $invoiceRecord->currency,

            // Point-in-time frozen student snapshot (from student_details JSON)
            'student' => [
                'name' => $studentDetails['name'] ?? 'Student',
                'email' => $studentDetails['email'] ?? '',
                'phone' => $studentDetails['phone'] ?? 'Not provided',
                'city' => $studentDetails['city'] ?? null,
                'state' => $studentDetails['state'] ?? null,
            ],

            // Point-in-time frozen course snapshot (from course_details JSON)
            'course' => [
                'id' => $courseDetails['id'] ?? $enrollment->course_id,
                'title' => $courseDetails['title'] ?? 'Course Enrollment',
                'slug' => $courseDetails['slug'] ?? ($enrollment->course?->slug ?? (string) $enrollment->course_id),
                'duration' => $courseDetails['duration'] ?? 'Self-paced',
                'type' => $courseDetails['type'] ?? 'recorded',
                'category' => $courseDetails['category'] ?? 'Software Development',
                'instructor_name' => $courseDetails['instructor_name'] ?? 'Comestro Faculty Team',
                'original_price' => (float) ($courseDetails['original_price'] ?? 0),
                'discount_price' => isset($courseDetails['discount_price']) && $courseDetails['discount_price'] !== null ? (float) $courseDetails['discount_price'] : null,
            ],

            'academy' => [
                'name' => 'Comestro Academy',
                'legal_name' => 'Comestro Tech Innovations Pvt. Ltd.',
                'address' => 'Plot #42, Software Technology Park, InfoTech Corridor',
                'city_state_pin' => 'Bhubaneswar, Odisha 751024, India',
                'email' => 'billing@comestro.com',
                'support_email' => 'support@comestro.com',
                'website' => 'academy.comestro.com',
                'gstin' => '21AAACC1234F1Z5',
                'pan' => 'AAACC1234F',
            ],
        ];

        return Inertia::render('Student/Invoices/Show', [
            'invoice' => $invoice,
            'enrollmentId' => $enrollment->id,
        ]);
    }
}
