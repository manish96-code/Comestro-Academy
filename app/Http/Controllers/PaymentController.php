<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Services\RazorpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Throwable;

class PaymentController extends Controller
{
    /**
     * Create a Razorpay order for enrolling in a paid course, or directly enroll if free.
     */
    public function createOrder(Request $request, Course $course, RazorpayService $razorpay): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Please log in or create an account to enroll in this course.',
            ], 401);
        }

        if ($course->status !== 'published') {
            return response()->json([
                'message' => 'This course is currently not open for enrollment.',
            ], 422);
        }

        // Check if user is already enrolled
        $alreadyEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json([
                'message' => 'You are already enrolled in this course.',
            ], 409);
        }

        // Determine effective payable price
        $price = (float) $course->price;
        $discountPrice = $course->discount_price !== null ? (float) $course->discount_price : null;

        $payableAmount = ($discountPrice !== null && $discountPrice < $price) ? $discountPrice : $price;

        // If the course is free (₹0), enroll immediately without payment
        if ($payableAmount <= 0) {
            Enrollment::firstOrCreate(
                ['user_id' => $user->id, 'course_id' => $course->id],
                ['status' => 'active', 'enrolled_at' => now()]
            );

            return response()->json([
                'free' => true,
                'message' => "Congratulations! You have successfully enrolled in {$course->title}.",
                'redirect_url' => route('student.courses.enrolled'),
            ]);
        }

        // Create a unique receipt identifier
        $receipt = 'rcpt_'.$user->id.'_'.$course->id.'_'.time();

        try {
            $order = $razorpay->createOrder(
                $payableAmount,
                $receipt,
                [
                    'course_id' => (string) $course->id,
                    'course_title' => mb_substr($course->title, 0, 40),
                    'user_id' => (string) $user->id,
                ]
            );

            // Record pending payment in database
            Payment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'razorpay_order_id' => $order['id'],
                'amount' => $payableAmount,
                'currency' => 'INR',
                'status' => 'pending',
            ]);

            return response()->json([
                'free' => false,
                'key' => $razorpay->getKeyId(),
                'order_id' => $order['id'],
                'amount' => $order['amount'],
                'currency' => 'INR',
                'course' => [
                    'id' => $course->id,
                    'title' => $course->title,
                    'thumbnail' => $course->thumbnail,
                    'formatted_price' => '₹'.number_format($payableAmount, 2),
                ],
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '',
                ],
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to initialize payment: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify payment signature from Razorpay and activate course enrollment.
     */
    public function verifyPayment(Request $request, Course $course, RazorpayService $razorpay): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login')->with('error', 'Please log in to complete your enrollment.');
        }

        $validated = $request->validate([
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
        ]);

        $orderId = $validated['razorpay_order_id'];
        $paymentId = $validated['razorpay_payment_id'];
        $signature = $validated['razorpay_signature'];

        // Retrieve recorded pending payment
        $payment = Payment::where('razorpay_order_id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        // Verify cryptographic HMAC signature
        $isSignatureValid = $razorpay->verifySignature($orderId, $paymentId, $signature);

        if (! $isSignatureValid) {
            if ($payment) {
                $payment->update([
                    'status' => 'failed',
                    'error_message' => 'Cryptographic signature verification failed.',
                ]);
            }

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment verification failed. Invalid signature.',
                ], 422);
            }

            return redirect()->back()->with('error', 'Payment verification failed. Please contact support if money was debited.');
        }

        // Mark payment successful
        if ($payment) {
            $payment->update([
                'razorpay_payment_id' => $paymentId,
                'razorpay_signature' => $signature,
                'status' => 'successful',
            ]);
        } else {
            // In case payment record was missing, record it now
            Payment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'razorpay_order_id' => $orderId,
                'razorpay_payment_id' => $paymentId,
                'razorpay_signature' => $signature,
                'amount' => (float) ($course->discount_price ?? $course->price),
                'currency' => 'INR',
                'status' => 'successful',
            ]);
        }

        // Activate course enrollment
        Enrollment::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['status' => 'active', 'enrolled_at' => now()]
        );

        $successMsg = "Payment successful! You have been enrolled in {$course->title}.";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $successMsg,
                'redirect_url' => route('student.courses.enrolled'),
            ]);
        }

        return redirect()->route('student.courses.enrolled')->with('success', $successMsg);
    }
}
