<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    // Display the student dashboard
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Student/Dashboard', [
            'student' => $user->only([
                'id',
                'name',
                'email',
                'phone',
                'role',
                'status',
                'created_at',
                'last_login_at',
            ]),
        ]);
    }

    // Display the student profile view and edit form
    public function profile(Request $request): Response
    {
        $user = $request->user()->load('studentProfile');

        return Inertia::render('Student/Profile', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'created_at' => $user->created_at,
                'last_login_at' => $user->last_login_at,
                'qualification' => $user->studentProfile?->qualification ?? '',
                'college_name' => $user->studentProfile?->college_name ?? '',
                'bio' => $user->studentProfile?->bio ?? '',
                'github_url' => $user->studentProfile?->github_url ?? '',
                'linkedin_url' => $user->studentProfile?->linkedin_url ?? '',
                'city' => $user->studentProfile?->city ?? '',
                'state' => $user->studentProfile?->state ?? '',
            ],
        ]);
    }

    // Update student profile details
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z ]+$/'],
            'email' => ['required', 'string', 'email', 'max:50', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'regex:/^[6-9]\d{9}$/'],
            'qualification' => ['nullable', 'string', 'max:100'],
            'college_name' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $user->studentProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'qualification' => $validated['qualification'] ?? null,
                'college_name' => $validated['college_name'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'github_url' => $validated['github_url'] ?? null,
                'linkedin_url' => $validated['linkedin_url'] ?? null,
                'city' => $validated['city'] ?? null,
                'state' => $validated['state'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Profile details updated successfully.');
    }

    // Update student password
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password updated successfully.');
    }
}
