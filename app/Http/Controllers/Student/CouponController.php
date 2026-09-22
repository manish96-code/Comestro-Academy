<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    // apply coupon
    public function apply(Request $request, Course $course, CouponService $couponService): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'valid' => false,
                'message' => 'Please log in to apply discount coupons.',
            ], 401);
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        $result = $couponService->validate($validated['code'], $course, $user);

        if (! $result['valid']) {
            return response()->json($result, 422);
        }

        return response()->json($result, 200);
    }
}
