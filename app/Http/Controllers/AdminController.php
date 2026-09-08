<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the Admin Dashboard.
     */
    public function dashboard(): Response
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalInstructors = User::where('role', 'instructor')->count();
        $totalAdmins = User::where('role', 'admin')->count();
        $activeUsers = User::where('status', 'active')->count();

        $recentUsers = User::latest()
            ->take(6)
            ->get(['id', 'name', 'email', 'phone', 'role', 'status', 'created_at', 'last_login_at']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_students' => $totalStudents,
                'total_instructors' => $totalInstructors,
                'total_admins' => $totalAdmins,
                'active_users' => $activeUsers,
                'total_courses' => 12,
                'live_classes_active' => 3,
            ],
            'recent_users' => $recentUsers,
        ]);
    }

    /**
     * Display the User Management page.
     */
    public function users(Request $request): Response
    {
        $roleFilter = $request->query('role');
        $query = User::query();

        if ($roleFilter && in_array($roleFilter, ['student', 'instructor', 'admin'])) {
            $query->where('role', $roleFilter);
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'role' => $roleFilter,
            ],
        ]);
    }

    /**
     * Update user status (active, inactive, suspended).
     */
    public function updateUserStatus(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,inactive,suspended'],
        ]);

        $user->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'User status updated successfully.');
    }
}
