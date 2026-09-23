<?php

use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;

test('admin can view certificates index with stats and listings', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $course = Course::factory()->create();

    // Create 3 distinct students each receiving a certificate for this course
    for ($i = 0; $i < 3; $i++) {
        $student = User::factory()->create(['role' => 'student']);
        Certificate::factory()->create([
            'user_id' => $student->id,
            'course_id' => $course->id,
        ]);
    }

    $response = $this->actingAs($admin)->get(route('admin.certificates.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Certificates/Index')
        ->has('certificates.data', 3)
        ->has('stats')
        ->where('stats.total_issued', 3)
    );
});

test('non-admin student cannot access admin certificates index', function () {
    $student = User::factory()->create(['role' => 'student']);

    $response = $this->actingAs($student)->get(route('admin.certificates.index'));

    $response->assertRedirect(route('student.dashboard'));
});

test('admin can toggle certificate status between active and revoked', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $certificate = Certificate::factory()->create(['status' => 'active']);

    $response = $this->actingAs($admin)->patch(route('admin.certificates.toggle-status', $certificate->id));

    $response->assertRedirect();
    expect($certificate->fresh()->status)->toBe('revoked');

    // Toggle back to active
    $this->actingAs($admin)->patch(route('admin.certificates.toggle-status', $certificate->id));
    expect($certificate->fresh()->status)->toBe('active');
});
