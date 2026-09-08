<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('student can view profile page', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
    ]);

    $response = $this->actingAs($student)->get(route('student.profile'));

    $response->assertOk();
});

test('student can update their profile information', function () {
    $student = User::factory()->create([
        'role' => 'student',
        'status' => 'active',
        'phone' => '9876543210',
    ]);

    $response = $this->actingAs($student)->patch(route('student.profile.update'), [
        'name' => 'Rahul Sharma',
        'email' => 'rahul.new@example.com',
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
    $this->assertDatabaseHas('users', [
        'id' => $student->id,
        'name' => 'Rahul Sharma',
        'email' => 'rahul.new@example.com',
        'phone' => '9988776655',
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
