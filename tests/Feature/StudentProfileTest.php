<?php

use App\Jobs\UploadProfilePicture;
use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;

test('student can view profile page', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $response = $this->actingAs($student)->get(route('student.profile'));

    $response->assertOk();
});

test('student can update their profile information but email cannot be changed', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
        'email' => 'rahul.original@example.com',
        'phone' => '9876543210',
    ]);

    $response = $this->actingAs($student)->patch(route('student.profile.update'), [
        'name' => 'Rahul Sharma',
        'email' => 'rahul.attempted@example.com',
        'phone' => '9988776655',
        'qualification' => 'B.Tech CSE',
        'college_name' => 'NIT Patna',
        'city' => 'Patna',
        'state' => 'Bihar',
        'github_url' => 'https://github.com/rahulsharma',
        'linkedin_url' => 'https://linkedin.com/in/rahulsharma',
        'bio' => 'Aspiring Full-Stack Software Engineer',
    ]);

    $response->assertRedirect();

    // Email remains unchanged
    $this->assertDatabaseHas('users', [
        'id' => $student->id,
        'name' => 'Rahul Sharma',
        'email' => 'rahul.original@example.com',
        'phone' => '9988776655',
    ]);

    $this->assertDatabaseMissing('users', [
        'id' => $student->id,
        'email' => 'rahul.attempted@example.com',
    ]);

    $this->assertDatabaseHas('student_profiles', [
        'user_id' => $student->id,
        'qualification' => 'B.Tech CSE',
        'college_name' => 'NIT Patna',
        'city' => 'Patna',
        'state' => 'Bihar',
        'github_url' => 'https://github.com/rahulsharma',
        'linkedin_url' => 'https://linkedin.com/in/rahulsharma',
        'bio' => 'Aspiring Full-Stack Software Engineer',
    ]);
});

test('student profile picture upload dispatches queued job', function () {
    Queue::fake();

    $student = User::factory()->create([
        'name' => 'Alice Smith',
        'role' => 'student',
        'status' => 'active',
    ]);

    $file = UploadedFile::fake()->image('profile.jpg');

    $response = $this->actingAs($student)->post(route('student.profile.update'), [
        'name' => 'Alice Smith',
        'profile_pic' => $file,
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    Queue::assertPushed(UploadProfilePicture::class, function ($job) use ($student) {
        return $job->user->id === $student->id;
    });
});

test('UploadProfilePicture job uploads image to imagekit and updates user', function () {
    $mockImageKit = Mockery::mock(ImageKitService::class);
    $mockImageKit->shouldReceive('uploadBase64')->once()->andReturn([
        'url' => 'https://ik.imagekit.io/comestro/profiles/test_photo.jpg',
        'fileId' => 'test_file_id',
    ]);

    $student = User::factory()->create([
        'name' => 'Alice Smith',
        'role' => 'student',
        'status' => 'active',
    ]);

    $file = UploadedFile::fake()->image('profile.jpg');
    $base64 = base64_encode($file->get());

    $job = new UploadProfilePicture(
        $student,
        $base64,
        $file->getClientOriginalName()
    );
    $job->handle($mockImageKit);

    $student->refresh();
    expect($student->profile_pic)->toBe('https://ik.imagekit.io/comestro/profiles/test_photo.jpg');
});

test('student can delete profile picture directly from database', function () {
    $student = User::factory()->create([
        'name' => 'Alice Smith',
        'role' => 'student',
        'status' => 'active',
        'profile_pic' => 'https://example.com/avatar.jpg',
    ]);

    $response = $this->actingAs($student)->delete(route('student.profile.pic.destroy'));

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();
    $student->refresh();
    expect($student->profile_pic)->toBeNull();
});

test('student can update their password', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
        'password' => Hash::make('old-password123'),
    ]);

    $response = $this->actingAs($student)->put(route('student.profile.password'), [
        'current_password' => 'old-password123',
        'password' => 'new-secure-password123',
        'password_confirmation' => 'new-secure-password123',
    ]);

    $response->assertRedirect();
    $this->assertTrue(Hash::check('new-secure-password123', $student->fresh()->password));
});
