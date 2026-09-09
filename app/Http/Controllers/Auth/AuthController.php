<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

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

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
