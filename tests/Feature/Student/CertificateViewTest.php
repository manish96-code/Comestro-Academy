<?php

use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;

test('student can view their earned certificate', function () {
    $student = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create();
    $certificate = Certificate::factory()->create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'certificate_number' => 'CA-2026-TEST01',
    ]);

    $response = $this->actingAs($student)->get(route('student.certificates.show', $certificate->id));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Certificates/Show')
        ->has('certificate')
        ->where('certificate.certificate_number', 'CA-2026-TEST01')
    );
});

test('student cannot view another students certificate directly via student route', function () {
    $student1 = User::factory()->create(['role' => 'student']);
    $student2 = User::factory()->create(['role' => 'student']);
    $course = Course::factory()->create();
    $certificate = Certificate::factory()->create([
        'user_id' => $student1->id,
        'course_id' => $course->id,
    ]);

    $response = $this->actingAs($student2)->get(route('student.certificates.show', $certificate->id));

    $response->assertForbidden();
});
