<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller
{
    public function showRegisterForm(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z ]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'phone' => ['required', 'string', 'regex:/^[6-9]\d{9}$/'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'student',
            'status' => 'active',
            'last_login_at' => now(),
        ]);

        Auth::login($user);

        if ($user->isAdmin() || $user->isInstructor()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        $intended = $request->session()->get('url.intended');
        if ($intended && str_contains($intended, '/admin')) {
            $request->session()->forget('url.intended');
        }

        return redirect()->intended(route('student.dashboard'));
    }

    public function showLoginForm(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => __('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();
        $user->update([
            'last_login_at' => now(),
        ]);

        if ($user->isAdmin() || $user->isInstructor()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        $intended = $request->session()->get('url.intended');
        if ($intended && str_contains($intended, '/admin')) {
            $request->session()->forget('url.intended');
        }

        return redirect()->intended(route('student.dashboard'));
    }

    public function redirectToGoogle(): RedirectResponse|\Symfony\Component\HttpFoundation\RedirectResponse
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (empty($clientId) || empty($clientSecret)) {
            return redirect()->route('login')->withErrors([
                'google' => 'Google Login is not configured yet. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.',
            ]);
        }

        try {
            return Socialite::driver('google')->stateless()->redirect();
        } catch (Throwable $e) {
            Log::error('Google redirect failed: '.$e->getMessage());

            return redirect()->route('login')->withErrors([
                'google' => 'Unable to connect to Google: '.$e->getMessage(),
            ]);
        }
    }

    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        if ($request->has('error')) {
            return redirect()->route('login')->withErrors([
                'google' => 'Google sign-in was cancelled or denied: '.$request->get('error_description', $request->get('error')),
            ]);
        }

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (Throwable $e) {
            Log::error('Google authentication callback failed', [
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);

            $message = ! empty(trim($e->getMessage()))
                ? $e->getMessage()
                : 'Invalid or expired session. Please try again.';

            return redirect()->route('login')->withErrors([
                'google' => 'Failed to authenticate with Google: '.$message,
            ]);
        }

        $email = $googleUser->getEmail();
        if (empty($email)) {
            return redirect()->route('login')->withErrors([
                'google' => 'No email address received from your Google account.',
            ]);
        }

        // Check if an account already exists with this google_id or email
        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            $updates = [
                'last_login_at' => now(),
            ];
            if (empty($user->google_id)) {
                $updates['google_id'] = $googleUser->getId();
            }
            if (empty($user->profile_pic) && $googleUser->getAvatar()) {
                $updates['profile_pic'] = $googleUser->getAvatar();
            }
            if (empty($user->email_verified_at)) {
                $updates['email_verified_at'] = now();
            }
            $user->update($updates);
        } else {
            // Create a new student account
            $user = User::create([
                'name' => $googleUser->getName() ?: 'Student',
                'email' => $email,
                'google_id' => $googleUser->getId(),
                'role' => 'student',
                'status' => 'active',
                'profile_pic' => $googleUser->getAvatar(),
                'password' => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
                'last_login_at' => now(),
            ]);
        }

        if ($user->status !== 'active') {
            return redirect()->route('login')->withErrors([
                'email' => 'Your account is '.$user->status.'. Please contact support.',
            ]);
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        if ($user->isAdmin() || $user->isInstructor()) {
            return redirect()->intended(route('admin.dashboard'));
        }

        $intended = $request->session()->get('url.intended');
        if ($intended && str_contains($intended, '/admin')) {
            $request->session()->forget('url.intended');
        }

        return redirect()->intended(route('student.dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
