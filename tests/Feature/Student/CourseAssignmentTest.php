<?php

use App\Models\AssignmentSubmission;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');

    $this->category = Category::create([
        'name' => 'Backend Engineering',
        'slug' => 'backend-engineering',
        'is_active' => true,
    ]);

    $this->course = Course::create([
        'category_id' => $this->category->id,
        'title' => 'Laravel Mastery',
        'slug' => 'laravel-mastery',
        'price' => 199,
        'status' => 'published',
    ]);
});

test('admin can create a course assignment with creator attribution', function () {
    $admin = User::factory()->create(['role' => 'admin', 'name' => 'Manish Admin']);

    $response = $this->actingAs($admin)->post(route('admin.courses.assignments.store', $this->course->id), [
        'title' => 'Build an Authentication Service',
        'description' => 'Implement Sanctum and JWT endpoints.',
        'total_marks' => 100,
        'passing_marks' => 40,
        'due_date' => now()->addDays(5)->toDateTimeString(),
        'is_published' => true,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('course_assignments', [
        'course_id' => $this->course->id,
        'created_by' => $admin->id,
        'title' => 'Build an Authentication Service',
        'total_marks' => 100,
        'passing_marks' => 40,
    ]);
});

test('student cannot view assignments of a course they are not enrolled in', function () {
    $student = User::factory()->create(['role' => 'student']);
    $assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'Private Task',
        'description' => 'Private instructions',
        'total_marks' => 100,
        'passing_marks' => 40,
    ]);

    $response = $this->actingAs($student)->get(route('student.assignments.show', $assignment->id));
    $response->assertForbidden();
});

test('student can view enrolled course assignment', function () {
    $student = User::factory()->create(['role' => 'student']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $this->course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'Public Enrolled Task',
        'description' => 'Instructions for enrolled students',
        'total_marks' => 100,
        'passing_marks' => 40,
    ]);

    $response = $this->actingAs($student)->get(route('student.assignments.show', $assignment->id));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Assignments/Show')
        ->where('assignment.title', 'Public Enrolled Task')
    );
});

test('student submission strictly rejects non-pdf files', function () {
    $student = User::factory()->create(['role' => 'student']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $this->course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'PDF Validation Test',
        'description' => 'Only PDF documents permitted',
        'total_marks' => 100,
        'passing_marks' => 40,
    ]);

    $fakeTxt = UploadedFile::fake()->create('solution.txt', 100, 'text/plain');

    $response = $this->actingAs($student)->post(route('student.assignments.submit', $assignment->id), [
        'pdf_file' => $fakeTxt,
    ]);

    $response->assertSessionHasErrors(['pdf_file']);
    $this->assertDatabaseMissing('assignment_submissions', [
        'course_assignment_id' => $assignment->id,
        'user_id' => $student->id,
    ]);
});

test('student can submit valid pdf and github url', function () {
    $student = User::factory()->create(['role' => 'student']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $this->course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'Portfolio Assignment',
        'description' => 'Upload documentation and repo',
        'total_marks' => 100,
        'passing_marks' => 40,
        'due_date' => now()->addDays(3),
    ]);

    $fakePdf = UploadedFile::fake()->create('architecture.pdf', 500, 'application/pdf');

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->with(Mockery::type(UploadedFile::class), '/assignments/submissions')
        ->andReturn([
            'url' => 'https://ik.imagekit.io/comestro/assignments/submissions/architecture.pdf',
            'fileId' => 'sub_123',
            'name' => 'architecture.pdf',
        ]);
    $this->app->instance(ImageKitService::class, $mockImageKit);

    $response = $this->actingAs($student)->post(route('student.assignments.submit', $assignment->id), [
        'pdf_file' => $fakePdf,
        'github_url' => 'https://github.com/rahul/my-portfolio',
        'submission_text' => 'Here is my completed solution.',
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('assignment_submissions', [
        'course_assignment_id' => $assignment->id,
        'user_id' => $student->id,
        'file_name' => 'architecture.pdf',
        'file_path' => 'https://ik.imagekit.io/comestro/assignments/submissions/architecture.pdf',
        'github_url' => 'https://github.com/rahul/my-portfolio',
        'is_late' => false,
        'status' => 'submitted',
    ]);
});

test('submission after due date is accepted and marked as late', function () {
    $student = User::factory()->create(['role' => 'student']);
    Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $this->course->id,
        'status' => 'active',
        'enrolled_at' => now(),
    ]);

    $assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'Overdue Task',
        'description' => 'Deadline passed 2 days ago',
        'total_marks' => 100,
        'passing_marks' => 40,
        'due_date' => now()->subDays(2), // Past deadline
    ]);

    $fakePdf = UploadedFile::fake()->create('late_doc.pdf', 300, 'application/pdf');

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->with(Mockery::type(UploadedFile::class), '/assignments/submissions')
        ->andReturn([
            'url' => 'https://ik.imagekit.io/comestro/assignments/submissions/late_doc.pdf',
            'fileId' => 'sub_456',
            'name' => 'late_doc.pdf',
        ]);
    $this->app->instance(ImageKitService::class, $mockImageKit);

    $response = $this->actingAs($student)->post(route('student.assignments.submit', $assignment->id), [
        'pdf_file' => $fakePdf,
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('assignment_submissions', [
        'course_assignment_id' => $assignment->id,
        'user_id' => $student->id,
        'file_name' => 'late_doc.pdf',
        'file_path' => 'https://ik.imagekit.io/comestro/assignments/submissions/late_doc.pdf',
        'is_late' => true,
        'status' => 'submitted',
    ]);
});

test('admin can grade student submission with marks and feedback', function () {
    $admin = User::factory()->create(['role' => 'admin', 'name' => 'Teacher Manish']);
    $student = User::factory()->create(['role' => 'student']);

    $assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'Final Capstone Project',
        'description' => 'Capstone task',
        'total_marks' => 100,
        'passing_marks' => 40,
    ]);

    $submission = AssignmentSubmission::create([
        'course_assignment_id' => $assignment->id,
        'user_id' => $student->id,
        'github_url' => 'https://github.com/student/capstone',
        'submitted_at' => now(),
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.assignments.submissions.grade', $submission->id), [
        'marks_obtained' => 95,
        'status' => 'reviewed',
        'feedback' => 'Superb implementation! Well structured and documented.',
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('assignment_submissions', [
        'id' => $submission->id,
        'marks_obtained' => 95,
        'status' => 'reviewed',
        'feedback' => 'Superb implementation! Well structured and documented.',
        'reviewed_by' => $admin->id,
    ]);
});

test('admin can upload attachment to imagekit when creating assignment', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->with(Mockery::type(UploadedFile::class), '/assignments/attachments')
        ->andReturn([
            'url' => 'https://ik.imagekit.io/comestro/assignments/starter_guide.pdf',
            'fileId' => 'asgn_starter_123',
            'name' => 'starter_guide.pdf',
        ]);
    $this->app->instance(ImageKitService::class, $mockImageKit);

    $fakeFile = UploadedFile::fake()->create('starter_guide.pdf', 500, 'application/pdf');

    $response = $this->actingAs($admin)->post(route('admin.courses.assignments.store', $this->course->id), [
        'title' => 'ImageKit Attached Assignment',
        'description' => 'Follow the starter guidelines in the PDF.',
        'total_marks' => 100,
        'passing_marks' => 50,
        'attachment' => $fakeFile,
        'is_published' => true,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('course_assignments', [
        'course_id' => $this->course->id,
        'title' => 'ImageKit Attached Assignment',
        'attachment_path' => 'https://ik.imagekit.io/comestro/assignments/starter_guide.pdf',
    ]);
});

test('admin can replace attachment with new imagekit upload on update', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $assignment = CourseAssignment::create([
        'course_id' => $this->course->id,
        'title' => 'Assignment To Update',
        'description' => 'Initial instructions',
        'total_marks' => 100,
        'passing_marks' => 40,
        'attachment_path' => 'https://ik.imagekit.io/comestro/assignments/old_guide.pdf',
    ]);

    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('upload')
        ->once()
        ->with(Mockery::type(UploadedFile::class), '/assignments/attachments')
        ->andReturn([
            'url' => 'https://ik.imagekit.io/comestro/assignments/new_revised_guide.pdf',
            'fileId' => 'asgn_revised_456',
            'name' => 'new_revised_guide.pdf',
        ]);
    $this->app->instance(ImageKitService::class, $mockImageKit);

    $newFile = UploadedFile::fake()->create('new_revised_guide.pdf', 600, 'application/pdf');

    $response = $this->actingAs($admin)->post(route('admin.courses.assignments.update', [$this->course->id, $assignment->id]), [
        'title' => 'Assignment Revised',
        'description' => 'Updated instructions with new starter file.',
        'total_marks' => 100,
        'passing_marks' => 40,
        'attachment' => $newFile,
        'is_published' => true,
    ]);

    $response->assertSessionHas('success');
    $this->assertDatabaseHas('course_assignments', [
        'id' => $assignment->id,
        'title' => 'Assignment Revised',
        'attachment_path' => 'https://ik.imagekit.io/comestro/assignments/new_revised_guide.pdf',
    ]);
});
