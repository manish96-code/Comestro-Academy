<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\CouponUsage;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CouponService
{
    /**
     * Validate a coupon code for a given course and user, and compute the discount.
     *
     * @return array{
     *     valid: bool,
     *     message: string,
     *     coupon: ?Coupon,
     *     original_price: float,
     *     discount_amount: float,
     *     payable_amount: float,
     *     formatted_discount: string,
     *     formatted_payable: string
     * }
     */
    public function validate(string $code, Course $course, User $user): array
    {
        $normalizedCode = strtoupper(trim($code));

        $originalPrice = (float) ($course->price ?? 0);
        $discountPrice = $course->discount_price !== null ? (float) $course->discount_price : null;
        $effectivePrice = ($discountPrice !== null && $discountPrice < $originalPrice) ? $discountPrice : $originalPrice;

        $defaultFailure = [
            'valid' => false,
            'message' => 'Invalid coupon code.',
            'coupon' => null,
            'original_price' => $effectivePrice,
            'discount_amount' => 0.00,
            'payable_amount' => $effectivePrice,
            'formatted_discount' => '₹0.00',
            'formatted_payable' => '₹'.number_format($effectivePrice, 2),
        ];

        if ($normalizedCode === '') {
            $defaultFailure['message'] = 'Please provide a coupon code.';

            return $defaultFailure;
        }

        $coupon = Coupon::where('code', $normalizedCode)->first();

        if (! $coupon) {
            $defaultFailure['message'] = "Coupon '{$normalizedCode}' does not exist.";

            return $defaultFailure;
        }

        if (! $coupon->is_active) {
            $defaultFailure['message'] = 'This coupon is currently inactive.';

            return $defaultFailure;
        }

        if (! $coupon->hasStarted()) {
            $defaultFailure['message'] = 'This promotional offer has not started yet.';

            return $defaultFailure;
        }

        if ($coupon->isExpired()) {
            $defaultFailure['message'] = 'This coupon has expired.';

            return $defaultFailure;
        }

        if ($coupon->hasReachedMaxUses()) {
            $defaultFailure['message'] = 'This coupon has reached its maximum redemption limit.';

            return $defaultFailure;
        }

        if ($coupon->hasReachedUserLimit($user->id)) {
            $defaultFailure['message'] = 'You have already redeemed this coupon.';

            return $defaultFailure;
        }

        if (! $coupon->isApplicableToCourse($course)) {
            $defaultFailure['message'] = 'This coupon is not valid for this specific course.';

            return $defaultFailure;
        }

        $minAmount = (float) $coupon->min_order_amount;
        if ($minAmount > 0 && $effectivePrice < $minAmount) {
            $defaultFailure['message'] = 'Minimum order amount of ₹'.number_format($minAmount, 2).' required to use this coupon.';

            return $defaultFailure;
        }

        $discountAmount = $coupon->calculateDiscount($effectivePrice);
        $payableAmount = max(0.00, round($effectivePrice - $discountAmount, 2));

        return [
            'valid' => true,
            'message' => 'Coupon applied successfully!',
            'coupon' => $coupon,
            'original_price' => $effectivePrice,
            'discount_amount' => $discountAmount,
            'payable_amount' => $payableAmount,
            'formatted_discount' => '₹'.number_format($discountAmount, 2),
            'formatted_payable' => '₹'.number_format($payableAmount, 2),
        ];
    }

    /**
     * Atomically record a coupon usage and increment its counter.
     */
    public function recordUsage(
        Coupon $coupon,
        User $user,
        Course $course,
        float $discountAmount,
        ?Enrollment $enrollment = null,
        ?Payment $payment = null
    ): CouponUsage {
        return DB::transaction(function () use ($coupon, $user, $course, $discountAmount, $enrollment, $payment) {
            $coupon->increment('used_count');

            return CouponUsage::create([
                'coupon_id' => $coupon->id,
                'user_id' => $user->id,
                'course_id' => $course->id,
                'enrollment_id' => $enrollment?->id,
                'payment_id' => $payment?->id,
                'discount_amount' => $discountAmount,
            ]);
        });
    }
}
