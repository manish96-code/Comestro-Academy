<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use App\Services\RazorpayService;

beforeEach(function () {
    $this->category = Category::create([
        'name' => 'Full-Stack Development',
        'slug' => 'full-stack-development',
        'status' => 'active',
    ]);
});

test('unauthenticated user cannot create payment order', function () {
    $course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Laravel Mastery',
        'slug' => 'laravel-mastery',
        'price' => 2999,
        'status' => 'published',
    ]);

    $response = $this->postJson(route('courses.payment.create-order', $course->id));

    $response->assertUnauthorized();
});

test('free course creates direct enrollment without razorpay order', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Git & GitHub Basics',
        'slug' => 'git-github-basics',
        'price' => 0,
        'status' => 'published',
    ]);

    $response = $this->actingAs($student)->postJson(route('courses.payment.create-order', $course->id));

    $response->assertOk()
        ->assertJson([
            'free' => true,
        ]);

    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);
    expect(Payment::count())->toBe(0);
});

test('paid course creates razorpay order and pending payment record', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Advanced Next.js 15',
        'slug' => 'advanced-nextjs-15',
        'price' => 4999,
        'discount_price' => 2499,
        'status' => 'published',
    ]);

    $mockRazorpay = Mockery::mock(RazorpayService::class);
    $mockRazorpay->shouldReceive('getKeyId')->andReturn('rzp_test_mock_key');
    $mockRazorpay->shouldReceive('createOrder')
        ->once()
        ->with(2499.0, Mockery::type('string'), Mockery::type('array'))
        ->andReturn([
            'id' => 'order_mock_12345',
            'amount' => 249900,
            'currency' => 'INR',
            'status' => 'created',
        ]);

    $this->app->instance(RazorpayService::class, $mockRazorpay);

    $response = $this->actingAs($student)->postJson(route('courses.payment.create-order', $course->id));

    $response->assertOk()
        ->assertJson([
            'free' => false,
            'key' => 'rzp_test_mock_key',
            'order_id' => 'order_mock_12345',
            'amount' => 249900,
        ]);

    $this->assertDatabaseHas('payments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'razorpay_order_id' => 'order_mock_12345',
        'amount' => 2499.00,
        'status' => 'pending',
    ]);
});

test('successful razorpay signature verification activates enrollment and marks payment successful', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Cloud Native Kubernetes',
        'slug' => 'cloud-native-kubernetes',
        'price' => 3999,
        'status' => 'published',
    ]);

    $payment = Payment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'razorpay_order_id' => 'order_mock_verify_1',
        'amount' => 3999,
        'currency' => 'INR',
        'status' => 'pending',
    ]);

    $mockRazorpay = Mockery::mock(RazorpayService::class);
    $mockRazorpay->shouldReceive('verifySignature')
        ->once()
        ->with('order_mock_verify_1', 'pay_mock_99999', 'valid_mock_signature')
        ->andReturn(true);

    $this->app->instance(RazorpayService::class, $mockRazorpay);

    $response = $this->actingAs($student)->post(route('courses.payment.verify', $course->id), [
        'razorpay_order_id' => 'order_mock_verify_1',
        'razorpay_payment_id' => 'pay_mock_99999',
        'razorpay_signature' => 'valid_mock_signature',
    ]);

    $response->assertRedirect(route('student.courses.enrolled'));

    $payment->refresh();
    expect($payment->status)->toBe('successful')
        ->and($payment->razorpay_payment_id)->toBe('pay_mock_99999');

    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
    ]);
});

test('invalid signature rejects verification and does not enroll user', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Cybersecurity Essentials',
        'slug' => 'cybersecurity-essentials',
        'price' => 1999,
        'status' => 'published',
    ]);

    $payment = Payment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'razorpay_order_id' => 'order_fake_999',
        'amount' => 1999,
        'currency' => 'INR',
        'status' => 'pending',
    ]);

    $mockRazorpay = Mockery::mock(RazorpayService::class);
    $mockRazorpay->shouldReceive('verifySignature')
        ->once()
        ->andReturn(false);

    $this->app->instance(RazorpayService::class, $mockRazorpay);

    $response = $this->actingAs($student)->post(route('courses.payment.verify', $course->id), [
        'razorpay_order_id' => 'order_fake_999',
        'razorpay_payment_id' => 'pay_fake_000',
        'razorpay_signature' => 'invalid_signature',
    ]);

    $payment->refresh();
    expect($payment->status)->toBe('failed');

    $this->assertDatabaseMissing('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
    ]);
});

test('already enrolled student cannot create payment order', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Python for AI',
        'slug' => 'python-for-ai',
        'price' => 2999,
        'status' => 'published',
    ]);

    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($student)->postJson(route('courses.payment.create-order', $course->id));

    $response->assertStatus(409)
        ->assertJson([
            'message' => 'You are already enrolled in this course.',
        ]);
});
