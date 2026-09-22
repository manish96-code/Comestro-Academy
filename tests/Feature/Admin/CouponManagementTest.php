<?php

use App\Models\Coupon;
use App\Models\Course;
use App\Models\User;

test('admin can view coupons list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Coupon::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.coupons.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Coupons/Index')
        ->has('coupons.data', 3)
        ->has('stats')
    );
});

test('non-admin cannot access coupon management', function () {
    $student = User::factory()->create(['role' => 'student']);

    $response = $this->actingAs($student)->get(route('admin.coupons.index'));

    $response->assertRedirect(route('student.dashboard'));
});

test('admin can create a percentage coupon', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.coupons.store'), [
        'code' => 'launch25',
        'name' => 'Launch Special',
        'discount_type' => 'percentage',
        'discount_value' => 25,
        'max_discount_amount' => 1000,
        'min_order_amount' => 500,
        'max_uses' => 50,
        'max_uses_per_user' => 1,
        'is_active' => true,
        'applies_to_all_courses' => true,
    ]);

    $response->assertRedirect(route('admin.coupons.index'));
    $this->assertDatabaseHas('coupons', [
        'code' => 'LAUNCH25',
        'discount_type' => 'percentage',
        'discount_value' => '25.00',
        'max_discount_amount' => '1000.00',
    ]);
});

test('admin can create a fixed amount coupon for specific courses', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $course1 = Course::factory()->create(['price' => 2999]);
    $course2 = Course::factory()->create(['price' => 4999]);

    $response = $this->actingAs($admin)->post(route('admin.coupons.store'), [
        'code' => 'FLAT500',
        'discount_type' => 'fixed',
        'discount_value' => 500,
        'min_order_amount' => 1000,
        'applies_to_all_courses' => false,
        'course_ids' => [$course1->id],
        'is_active' => true,
    ]);

    $response->assertRedirect(route('admin.coupons.index'));
    $this->assertDatabaseHas('coupons', [
        'code' => 'FLAT500',
        'discount_type' => 'fixed',
        'discount_value' => '500.00',
        'applies_to_all_courses' => false,
    ]);

    $coupon = Coupon::where('code', 'FLAT500')->first();
    expect($coupon->courses()->pluck('courses.id')->toArray())->toContain($course1->id)
        ->not->toContain($course2->id);
});

test('admin cannot create coupon with duplicate code', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Coupon::factory()->create(['code' => 'DUPLICATE']);

    $response = $this->actingAs($admin)->post(route('admin.coupons.store'), [
        'code' => 'duplicate',
        'discount_type' => 'percentage',
        'discount_value' => 10,
    ]);

    $response->assertSessionHasErrors('code');
});

test('admin can update a coupon', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $coupon = Coupon::factory()->create([
        'code' => 'UPDATE10',
        'discount_value' => 10,
    ]);

    $response = $this->actingAs($admin)->patch(route('admin.coupons.update', $coupon->id), [
        'code' => 'UPDATE20',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'is_active' => true,
        'applies_to_all_courses' => true,
    ]);

    $response->assertRedirect(route('admin.coupons.index'));
    $this->assertDatabaseHas('coupons', [
        'id' => $coupon->id,
        'code' => 'UPDATE20',
        'discount_value' => '20.00',
    ]);
});

test('admin can toggle coupon status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $coupon = Coupon::factory()->create(['is_active' => true]);

    $response = $this->actingAs($admin)->patch(route('admin.coupons.toggle-status', $coupon->id));

    $response->assertRedirect();
    expect($coupon->fresh()->is_active)->toBeFalse();

    $this->actingAs($admin)->patch(route('admin.coupons.toggle-status', $coupon->id));
    expect($coupon->fresh()->is_active)->toBeTrue();
});

test('admin can delete a coupon', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $coupon = Coupon::factory()->create();

    $response = $this->actingAs($admin)->delete(route('admin.coupons.destroy', $coupon->id));

    $response->assertRedirect(route('admin.coupons.index'));
    $this->assertDatabaseMissing('coupons', ['id' => $coupon->id]);
});
