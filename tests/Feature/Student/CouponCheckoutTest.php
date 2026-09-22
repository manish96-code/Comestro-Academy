<?php

use App\Models\Coupon;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\User;

test('student can validate a valid percentage coupon', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['price' => 2000, 'discount_price' => null, 'status' => 'published']);
    $coupon = Coupon::factory()->create([
        'code' => 'TEST20',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'max_discount_amount' => null,
        'min_order_amount' => 500,
        'is_active' => true,
        'applies_to_all_courses' => true,
    ]);

    $response = $this->actingAs($student)->postJson(route('courses.apply-coupon', $course->id), [
        'code' => 'TEST20',
    ]);

    $response->assertOk();
    $response->assertJson([
        'valid' => true,
        'discount_amount' => 400,
        'payable_amount' => 1600,
    ]);
});

test('student cannot validate expired or inactive coupon', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['price' => 2000, 'status' => 'published']);
    $expiredCoupon = Coupon::factory()->expired()->create(['code' => 'EXPIRED']);
    $inactiveCoupon = Coupon::factory()->inactive()->create(['code' => 'INACTIVE']);

    $response1 = $this->actingAs($student)->postJson(route('courses.apply-coupon', $course->id), [
        'code' => 'EXPIRED',
    ]);
    $response1->assertStatus(422);

    $response2 = $this->actingAs($student)->postJson(route('courses.apply-coupon', $course->id), [
        'code' => 'INACTIVE',
    ]);
    $response2->assertStatus(422);
});

test('student cannot validate coupon below minimum order amount', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['price' => 500, 'discount_price' => null, 'status' => 'published']);
    $coupon = Coupon::factory()->create([
        'code' => 'MIN1000',
        'min_order_amount' => 1000,
        'is_active' => true,
    ]);

    $response = $this->actingAs($student)->postJson(route('courses.apply-coupon', $course->id), [
        'code' => 'MIN1000',
    ]);

    $response->assertStatus(422);
    $response->assertJson([
        'valid' => false,
    ]);
});

test('student cannot use coupon on ineligible course', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course1 = Course::factory()->create(['price' => 2000, 'status' => 'published']);
    $course2 = Course::factory()->create(['price' => 2000, 'status' => 'published']);

    $coupon = Coupon::factory()->create([
        'code' => 'COURSE1ONLY',
        'applies_to_all_courses' => false,
        'is_active' => true,
    ]);
    $coupon->courses()->attach($course1->id);

    // Should fail on course2
    $response = $this->actingAs($student)->postJson(route('courses.apply-coupon', $course2->id), [
        'code' => 'COURSE1ONLY',
    ]);

    $response->assertStatus(422);
    $response->assertJson([
        'valid' => false,
    ]);
});

test('student cannot exceed per-user coupon limit', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['price' => 2000, 'status' => 'published']);
    $coupon = Coupon::factory()->create([
        'code' => 'ONCEONLY',
        'max_uses_per_user' => 1,
        'is_active' => true,
    ]);

    // Simulate previous usage
    $coupon->usages()->create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'discount_amount' => 200,
    ]);

    $response = $this->actingAs($student)->postJson(route('courses.apply-coupon', $course->id), [
        'code' => 'ONCEONLY',
    ]);

    $response->assertStatus(422);
    $response->assertJson([
        'valid' => false,
    ]);
});

test('100% discount coupon enrolls student directly without payment gateway', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create(['price' => 1999, 'discount_price' => null, 'status' => 'published', 'type' => 'recorded']);
    $coupon = Coupon::factory()->create([
        'code' => 'FREE100',
        'discount_type' => 'percentage',
        'discount_value' => 100,
        'max_discount_amount' => null,
        'is_active' => true,
        'applies_to_all_courses' => true,
    ]);

    $response = $this->actingAs($student)->postJson(route('courses.payment.create-order', $course->id), [
        'coupon_code' => 'FREE100',
    ]);

    $response->assertOk();
    $response->assertJson([
        'free' => true,
    ]);

    // Verify enrollment created
    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);

    // Verify coupon usage recorded
    $this->assertDatabaseHas('coupon_usages', [
        'coupon_id' => $coupon->id,
        'user_id' => $student->id,
        'course_id' => $course->id,
        'discount_amount' => '1999.00',
    ]);

    // Verify coupon count incremented
    expect($coupon->fresh()->used_count)->toBe(1);

    // Verify invoice snapshot captured coupon details
    $enrollment = Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->first();
    $invoice = Invoice::where('enrollment_id', $enrollment->id)->first();
    expect($invoice)->not->toBeNull();
    expect($invoice->course_details['coupon_code'])->toBe('FREE100');
    expect((float) $invoice->course_details['coupon_discount'])->toBe(1999.00);
});
