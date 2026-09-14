<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Payment;
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

        // Retrieve student's enrollments with course details
        $enrollments = $user->enrollments()
            ->with(['course.category', 'course.instructor.user'])
            ->latest('enrolled_at')
            ->paginate(10);

        // Preload successful payments to avoid N+1 queries
        $courseIds = $enrollments->pluck('course_id')->filter()->unique();
        $payments = Payment::where('user_id', $user->id)
            ->whereIn('course_id', $courseIds)
            ->where('status', 'successful')
            ->latest()
            ->get()
            ->keyBy('course_id');

        $enrollments->through(function ($enrollment) use ($payments) {
            $payment = $payments->get($enrollment->course_id);
            $year = date('Y', strtotime($enrollment->enrolled_at ?? $enrollment->created_at));
            $enrollment->invoice_number = 'INV-'.$year.'-'.str_pad((string) $enrollment->id, 5, '0', STR_PAD_LEFT);
            $enrollment->paid_amount = $payment ? (float) $payment->amount : 0.00;
            $enrollment->payment_method = $payment ? 'Razorpay Online' : 'Free Enrollment';
            $enrollment->payment_id = $payment?->razorpay_payment_id;
            $enrollment->currency = $payment?->currency ?? 'INR';

            return $enrollment;
        });

        // Summary statistics
        $totalSpent = Payment::where('user_id', $user->id)
            ->where('status', 'successful')
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
     * Display the specified invoice for an enrollment.
     */
    public function show(Request $request, Enrollment $enrollment): Response
    {
        $user = $request->user();

        // Authorization check
        if ($enrollment->user_id !== $user->id && ! $user->isAdmin()) {
            abort(403, 'Unauthorized access to this course invoice.');
        }

        $enrollment->load([
            'course.category',
            'course.instructor.user',
            'user.studentProfile',
        ]);

        // Find associated successful payment if exists
        $payment = Payment::where('user_id', $enrollment->user_id)
            ->where('course_id', $enrollment->course_id)
            ->where('status', 'successful')
            ->latest()
            ->first();

        $enrolledDate = $enrollment->enrolled_at ?? $enrollment->created_at;
        $year = date('Y', strtotime($enrolledDate));
        $invoiceNumber = 'INV-'.$year.'-'.str_pad((string) $enrollment->id, 5, '0', STR_PAD_LEFT);

        $course = $enrollment->course;
        $originalPrice = (float) ($course->price ?? 0);
        $discountPrice = $course->discount_price !== null ? (float) $course->discount_price : null;
        $paidAmount = $payment ? (float) $payment->amount : (($discountPrice !== null ? $discountPrice : $originalPrice) <= 0 ? 0.00 : 0.00);

        $invoice = [
            'id' => $enrollment->id,
            'invoice_number' => $invoiceNumber,
            'date' => $enrolledDate->format('d M, Y'),
            'time' => $enrolledDate->format('h:i A'),
            'status' => 'PAID',
            'payment_method' => $payment ? 'Razorpay Secure Payment' : 'Complimentary / Free Enrollment',
            'transaction_id' => $payment?->razorpay_payment_id ?? 'FREE-ADM-'.str_pad((string) $enrollment->id, 6, '0', STR_PAD_LEFT),
            'order_id' => $payment?->razorpay_order_id,
            'amount' => $paidAmount,
            'currency' => $payment?->currency ?? 'INR',
            'student' => [
                'name' => $enrollment->user->name,
                'email' => $enrollment->user->email,
                'phone' => $enrollment->user->phone ?? 'Not provided',
                'city' => $enrollment->user->studentProfile?->city,
                'state' => $enrollment->user->studentProfile?->state,
            ],
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'duration' => $course->duration ?? 'Self-paced',
                'type' => $course->type ?? 'recorded',
                'category' => $course->category?->name ?? 'Software Development',
                'instructor_name' => $course->instructor?->user?->name ?? 'Comestro Faculty Team',
                'original_price' => $originalPrice,
                'discount_price' => $discountPrice,
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
