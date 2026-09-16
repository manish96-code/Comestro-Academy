<?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use App\Services\RazorpayService;

test('student must select a batch when enrolling in a live course', function () {
    $student = User::factory()->create(['role' => 'student', 'status' => 'active']);
    $category = Category::create([
        'name' => 'Full-Stack',
        'slug' => 'full-stack',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Live MERN Cohort',
        'slug' => 'live-mern-cohort',
        'price' => 0,
        'status' => 'published',
        'type' => 'live',
    ]);

    $batch = $course->batches()->create([
        'batch_name' => 'Morning Slot',
        'time_slot' => '09:00 AM - 10:00 AM',
        'days' => 'Monday - Friday',
        'is_active' => true,
    ]);

    // Attempt enrollment without batch_id
    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id), []);

    $response->assertSessionHasErrors(['batch_id']);
    $this->assertDatabaseMissing('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
    ]);

    // Now enroll with valid batch_id
    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id), [
        'batch_id' => $batch->id,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'batch_id' => $batch->id,
        'status' => 'active',
    ]);

    // Check invoice snapshot has batch details
    $enrollment = Enrollment::where('user_id', $student->id)->where('course_id', $course->id)->first();
    $invoice = Invoice::where('enrollment_id', $enrollment->id)->first();
    expect($invoice)->not->toBeNull();
    expect($invoice->course_details['batch'])->not->toBeNull();
    expect($invoice->course_details['batch']['time_slot'])->toBe('09:00 AM - 10:00 AM');
    expect($invoice->course_details['batch']['batch_name'])->toBe('Morning Slot');
});

test('student can enroll in a recorded course without batch_id', function () {
    $student = User::factory()->create(['role' => 'student', 'status' => 'active']);
    $category = Category::create([
        'name' => 'Backend',
        'slug' => 'backend',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Recorded Laravel 12 API Mastery',
        'slug' => 'recorded-laravel-12-api-mastery',
        'price' => 0,
        'status' => 'published',
        'type' => 'recorded',
    ]);

    $response = $this->actingAs($student)->post(route('student.courses.enroll', $course->id), []);

    $response->assertRedirect();
    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'batch_id' => null,
        'status' => 'active',
    ]);
});

test('payment create-order requires batch_id for live courses', function () {
    $student = User::factory()->create(['role' => 'student', 'status' => 'active']);
    $category = Category::create([
        'name' => 'Cloud',
        'slug' => 'cloud',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Live AWS Cloud Masterclass',
        'slug' => 'live-aws-cloud-masterclass',
        'price' => 4999,
        'status' => 'published',
        'type' => 'live',
    ]);

    $batch = $course->batches()->create([
        'batch_name' => 'Afternoon Slot',
        'time_slot' => '02:00 PM - 03:00 PM',
        'is_active' => true,
    ]);

    // Without batch_id
    $response = $this->actingAs($student)->postJson(route('courses.payment.create-order', $course->id), []);
    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['batch_id']);

    // Mock Razorpay
    $razorpayMock = Mockery::mock(RazorpayService::class);
    $razorpayMock->shouldReceive('createOrder')->once()->andReturn([
        'id' => 'order_test_12345',
        'amount' => 499900,
    ]);
    $razorpayMock->shouldReceive('getKeyId')->once()->andReturn('rzp_test_mock_key');
    $this->app->instance(RazorpayService::class, $razorpayMock);

    // With valid batch_id
    $response = $this->actingAs($student)->postJson(route('courses.payment.create-order', $course->id), [
        'batch_id' => $batch->id,
    ]);

    $response->assertOk();
    $response->assertJson([
        'free' => false,
        'order_id' => 'order_test_12345',
        'batch_id' => $batch->id,
    ]);
});

test('payment verify associates batch_id with enrollment for live courses', function () {
    $student = User::factory()->create(['role' => 'student', 'status' => 'active']);
    $category = Category::create([
        'name' => 'AI',
        'slug' => 'ai',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Live Generative AI Masterclass',
        'slug' => 'live-gen-ai-masterclass',
        'price' => 6999,
        'status' => 'published',
        'type' => 'live',
    ]);

    $batch = $course->batches()->create([
        'batch_name' => 'Morning Batch',
        'time_slot' => '09:00 AM - 10:00 AM',
        'is_active' => true,
    ]);

    $payment = Payment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'razorpay_order_id' => 'order_mock_9999',
        'amount' => 6999,
        'currency' => 'INR',
        'status' => 'pending',
    ]);

    $razorpayMock = Mockery::mock(RazorpayService::class);
    $razorpayMock->shouldReceive('verifySignature')->once()->andReturn(true);
    $this->app->instance(RazorpayService::class, $razorpayMock);

    $response = $this->actingAs($student)->post(route('courses.payment.verify', $course->id), [
        'razorpay_order_id' => 'order_mock_9999',
        'razorpay_payment_id' => 'pay_mock_1111',
        'razorpay_signature' => 'valid_mock_signature',
        'batch_id' => $batch->id,
    ]);

    $response->assertRedirect(route('student.courses.enrolled'));

    $this->assertDatabaseHas('enrollments', [
        'user_id' => $student->id,
        'course_id' => $course->id,
        'batch_id' => $batch->id,
        'status' => 'active',
    ]);
});
