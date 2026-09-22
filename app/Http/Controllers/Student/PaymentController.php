<?php

namespace App\Http\Controllers\Student;

use App\Events\StudentEnrolledEvent;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Payment;
use App\Services\CouponService;
use App\Services\RazorpayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Throwable;

class PaymentController extends Controller
{
    //  Create a Razorpay order for enrolling in a paid course, or directly enroll if free.
    public function createOrder(Request $request, Course $course, RazorpayService $razorpay, CouponService $couponService): JsonResponse
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

        $batchRules = ['nullable', 'integer', Rule::exists('course_batches', 'id')->where('course_id', $course->id)->where('is_active', true)];
        if ($course->type === 'live') {
            $batchRules = ['required', 'integer', Rule::exists('course_batches', 'id')->where('course_id', $course->id)->where('is_active', true)];
        }

        $validated = $request->validate([
            'batch_id' => $batchRules,
            'coupon_code' => ['nullable', 'string', 'max:50'],
        ], [
            'batch_id.required' => 'Please select a batch timing to enroll in this live cohort.',
            'batch_id.exists' => 'The selected batch timing is invalid or no longer available.',
        ]);

        $batchId = $validated['batch_id'] ?? null;
        $couponCode = $validated['coupon_code'] ?? null;

        // Determine effective base price
        $price = (float) $course->price;
        $discountPrice = $course->discount_price !== null ? (float) $course->discount_price : null;
        $effectivePrice = ($discountPrice !== null && $discountPrice < $price) ? $discountPrice : $price;

        $coupon = null;
        $couponDiscount = 0.00;
        $payableAmount = $effectivePrice;

        if ($couponCode) {
            $couponResult = $couponService->validate($couponCode, $course, $user);
            if (! $couponResult['valid']) {
                return response()->json([
                    'message' => $couponResult['message'],
                ], 422);
            }
            $coupon = $couponResult['coupon'];
            $couponDiscount = $couponResult['discount_amount'];
            $payableAmount = $couponResult['payable_amount'];
        }

        // If the payable amount is free (₹0), enroll immediately without payment
        if ($payableAmount <= 0) {
            $enrollment = Enrollment::firstOrCreate(
                ['user_id' => $user->id, 'course_id' => $course->id],
                ['batch_id' => $batchId, 'status' => 'active', 'enrolled_at' => now()]
            );

            if ($batchId && ! $enrollment->batch_id) {
                $enrollment->update(['batch_id' => $batchId]);
            }

            if ($coupon && $couponDiscount > 0) {
                $couponService->recordUsage($coupon, $user, $course, $couponDiscount, $enrollment);
            }

            Invoice::createSnapshot($enrollment, null, $coupon, $couponDiscount);

            StudentEnrolledEvent::dispatchSafely($enrollment);

            $successMsg = "Congratulations! You have successfully enrolled in {$course->title}.";
            session()->flash('success', $successMsg);

            return response()->json([
                'free' => true,
                'message' => $successMsg,
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
                    'batch_id' => (string) ($batchId ?? ''),
                    'coupon_code' => (string) ($coupon?->code ?? ''),
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
                'batch_id' => $batchId,
                'coupon_code' => $coupon?->code,
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
    public function verifyPayment(Request $request, Course $course, RazorpayService $razorpay, CouponService $couponService): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login')->with('error', 'Please log in to complete your enrollment.');
        }

        $validated = $request->validate([
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
            'batch_id' => ['nullable', 'integer'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
        ]);

        $orderId = $validated['razorpay_order_id'];
        $paymentId = $validated['razorpay_payment_id'];
        $signature = $validated['razorpay_signature'];
        $batchId = $validated['batch_id'] ?? null;
        $couponCode = $validated['coupon_code'] ?? null;

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
        $enrollment = Enrollment::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['batch_id' => $batchId, 'status' => 'active', 'enrolled_at' => now()]
        );

        if ($batchId && ! $enrollment->batch_id) {
            $enrollment->update(['batch_id' => $batchId]);
        }

        $coupon = null;
        $couponDiscount = 0.00;
        if ($couponCode) {
            $couponResult = $couponService->validate($couponCode, $course, $user);
            if ($couponResult['valid']) {
                $coupon = $couponResult['coupon'];
                $couponDiscount = $couponResult['discount_amount'];
            }
        }

        if ($coupon && $couponDiscount > 0) {
            $couponService->recordUsage($coupon, $user, $course, $couponDiscount, $enrollment, $payment);
        }

        Invoice::createSnapshot($enrollment, $payment, $coupon, $couponDiscount);

        StudentEnrolledEvent::dispatchSafely($enrollment);

        $successMsg = "Payment successful! You have been enrolled in {$course->title}.";
        session()->flash('success', $successMsg);

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
