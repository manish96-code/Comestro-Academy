    <?php

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;

test('guest cannot access student invoices', function () {
    $response = $this->get(route('student.invoices.index'));

    $response->assertRedirect(route('login'));
});

test('student can view their invoices index page', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Backend Engineering',
        'slug' => 'backend-engineering',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Mastering Laravel & Inertia',
        'slug' => 'mastering-laravel-inertia',
        'price' => 2999,
        'status' => 'published',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    Payment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'razorpay_order_id' => 'order_test_12345',
        'razorpay_payment_id' => 'pay_test_12345',
        'razorpay_signature' => 'sig_test_12345',
        'amount' => 2999.00,
        'currency' => 'INR',
        'status' => 'successful',
    ]);

    $response = $this->actingAs($student)->get(route('student.invoices.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Invoices/Index')
        ->has('enrollments.data', 1)
        ->has('stats')
        ->where('stats.total_invoices', 1)
        ->where('stats.total_spent', fn ($val) => (float) $val == 2999.0)
    );
});

test('student can view specific invoice for their enrolled course', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Frontend Architecture',
        'slug' => 'frontend-architecture',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Advanced React & Tailwind',
        'slug' => 'advanced-react-tailwind',
        'price' => 1999,
        'status' => 'published',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($student)->get(route('student.invoices.show', $enrollment));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Invoices/Show')
        ->has('invoice')
        ->where('invoice.course.title', 'Advanced React & Tailwind')
        ->where('invoice.status', 'PAID')
    );
});

test('student cannot view another student invoice', function () {
    $studentA = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $studentB = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Cyber Security',
        'slug' => 'cyber-security',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Ethical Hacking 101',
        'slug' => 'ethical-hacking-101',
        'price' => 3999,
        'status' => 'published',
    ]);

    $enrollmentA = Enrollment::create([
        'user_id' => $studentA->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $response = $this->actingAs($studentB)->get(route('student.invoices.show', $enrollmentA));

    $response->assertForbidden();
});

test('invoice preserves snapshot student name even if student changes profile name later', function () {
    $student = User::factory()->create([
        'name' => 'Rahul Verma',
        'email' => 'rahul@example.com',
        'role' => 'student',
        'status' => 'active',
    ]);

    $category = Category::create([
        'name' => 'Mobile App Development',
        'slug' => 'mobile-app-development',
        'status' => 'active',
    ]);

    $course = Course::create([
        'category_id' => $category->id,
        'title' => 'Cross-Platform Mobile Apps with Flutter & Dart',
        'slug' => 'flutter-dart',
        'price' => 2199,
        'status' => 'published',
    ]);

    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    Invoice::createSnapshot($enrollment);

    // Later, student changes their name in profile
    $student->update([
        'name' => 'Rahul Sharma (Updated Name)',
        'email' => 'new.rahul@example.com',
    ]);

    $response = $this->actingAs($student)->get(route('student.invoices.show', $enrollment));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Invoices/Show')
        ->where('invoice.student.name', 'Rahul Verma')
        ->where('invoice.student.email', 'rahul@example.com')
    );

    // Verify in database directly as well
    $savedInvoice = Invoice::where('enrollment_id', $enrollment->id)->first();
    expect($savedInvoice->student_details['name'])->toBe('Rahul Verma')
        ->and($savedInvoice->student_details['email'])->toBe('rahul@example.com')
        ->and($savedInvoice->course_details['title'])->toBe('Cross-Platform Mobile Apps with Flutter & Dart');
});
