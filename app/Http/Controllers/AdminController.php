<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    // Display the Admin Dashboard.
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

    // Display Students list for Admin.
    public function students(Request $request): Response
    {
        $search = $request->query('search');

        $query = User::where('role', 'student');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $students = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Display single Student profile details and enrolled courses.
    public function showStudent(User $student): Response
    {
        $student->load([
            'studentProfile',
            'enrollments.course.category',
        ]);

        $enrolledCourseIds = $student->enrollments->pluck('course_id');

        $availableCourses = Course::where('status', 'published')
            ->whereNotIn('id', $enrolledCourseIds)
            ->orderBy('title')
            ->get(['id', 'title', 'slug', 'thumbnail', 'price', 'discount_price', 'duration']);

        return Inertia::render('Admin/Students/Show', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'phone' => $student->phone,
                'role' => $student->role,
                'status' => $student->status,
                'created_at' => $student->created_at,
                'last_login_at' => $student->last_login_at,
                'qualification' => $student->studentProfile?->qualification ?? '',
                'college_name' => $student->studentProfile?->college_name ?? '',
                'bio' => $student->studentProfile?->bio ?? '',
                'github_url' => $student->studentProfile?->github_url ?? '',
                'linkedin_url' => $student->studentProfile?->linkedin_url ?? '',
                'city' => $student->studentProfile?->city ?? '',
                'state' => $student->studentProfile?->state ?? '',
            ],
            'enrollments' => $student->enrollments,
            'availableCourses' => $availableCourses,
        ]);
    }

    // Update Student profile details.
    public function updateStudent(Request $request, User $student): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z ]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($student->id)],
            'phone' => ['nullable', 'string', 'regex:/^[6-9]\d{9}$/'],
            'status' => ['required', 'in:active,inactive,suspended'],
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Student details updated successfully.');
    }

    // Display Instructors list for Admin.
    public function instructors(Request $request): Response
    {
        $search = $request->query('search');

        $query = User::where('role', 'instructor')->with('instructorProfile');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('instructorProfile', function ($iq) use ($search) {
                        $iq->where('designation', 'like', "%{$search}%")
                            ->orWhere('expertise', 'like', "%{$search}%");
                    });
            });
        }

        $instructors = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Instructors/Index', [
            'instructors' => $instructors,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // Display Create Instructor form.
    public function createInstructor(): Response
    {
        return Inertia::render('Admin/Instructors/Create');
    }

    // Store new Instructor.
    public function storeInstructor(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z ]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'regex:/^[6-9]\d{9}$/'],
            'password' => ['required', 'string', Password::min(8)],
            'status' => ['required', 'in:active,inactive,suspended'],
            'designation' => ['nullable', 'string', 'max:100'],
            'qualification' => ['nullable', 'string', 'max:100'],
            'expertise' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'instructor',
            'status' => $validated['status'],
        ]);

        $user->instructorProfile()->create([
            'designation' => $validated['designation'] ?? null,
            'qualification' => $validated['qualification'] ?? null,
            'expertise' => $validated['expertise'] ?? null,
            'experience_years' => $validated['experience_years'] ?? 0,
            'bio' => $validated['bio'] ?? null,
        ]);

        return redirect()->route('admin.instructors.index')->with('success', 'Instructor created successfully.');
    }

    // Display single Instructor profile details.
    public function showInstructor(User $instructor): Response
    {
        $instructor->load('instructorProfile');

        return Inertia::render('Admin/Instructors/Show', [
            'instructor' => [
                'id' => $instructor->id,
                'name' => $instructor->name,
                'email' => $instructor->email,
                'phone' => $instructor->phone,
                'role' => $instructor->role,
                'status' => $instructor->status,
                'created_at' => $instructor->created_at,
                'last_login_at' => $instructor->last_login_at,
                'designation' => $instructor->instructorProfile?->designation ?? '',
                'qualification' => $instructor->instructorProfile?->qualification ?? '',
                'expertise' => $instructor->instructorProfile?->expertise ?? '',
                'experience_years' => $instructor->instructorProfile?->experience_years ?? 0,
                'bio' => $instructor->instructorProfile?->bio ?? '',
            ],
        ]);
    }

    // Update Instructor details.
    public function updateInstructor(Request $request, User $instructor): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z ]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($instructor->id)],
            'phone' => ['nullable', 'string', 'regex:/^[6-9]\d{9}$/'],
            'status' => ['required', 'in:active,inactive,suspended'],
            'password' => ['nullable', 'string', Password::min(8)],
            'designation' => ['nullable', 'string', 'max:100'],
            'qualification' => ['nullable', 'string', 'max:100'],
            'expertise' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'status' => $validated['status'],
        ];

        if (! empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $instructor->update($userData);

        $instructor->instructorProfile()->updateOrCreate(
            ['user_id' => $instructor->id],
            [
                'designation' => $validated['designation'] ?? null,
                'qualification' => $validated['qualification'] ?? null,
                'expertise' => $validated['expertise'] ?? null,
                'experience_years' => $validated['experience_years'] ?? 0,
                'bio' => $validated['bio'] ?? null,
            ]
        );

        return redirect()->back()->with('success', 'Instructor details updated successfully.');
    }

    // Enroll a student into a course directly from their student profile.
    public function enrollStudent(Request $request, User $student): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'exists:courses,id'],
            'status' => ['required', 'in:active,completed,cancelled'],
        ]);

        Enrollment::updateOrCreate(
            [
                'user_id' => $student->id,
                'course_id' => $validated['course_id'],
            ],
            [
                'status' => $validated['status'],
                'enrolled_at' => now(),
            ]
        );

        return redirect()->back()->with('success', 'Student successfully enrolled into the course.');
    }

    // Update an enrollment status.
    public function updateEnrollment(Request $request, Enrollment $enrollment): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:active,completed,cancelled'],
        ]);

        $enrollment->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Enrollment status updated to '.ucfirst($validated['status']).'.');
    }

    // Remove / unenroll a student from a course.
    public function destroyEnrollment(Enrollment $enrollment): RedirectResponse
    {
        $enrollment->delete();

        return redirect()->back()->with('success', 'Course enrollment removed successfully.');
    }

    // Store a manual course enrollment from the global enrollments page.
    public function storeEnrollment(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
            'status' => ['required', 'in:active,completed,cancelled'],
        ]);

        Enrollment::updateOrCreate(
            [
                'user_id' => $validated['user_id'],
                'course_id' => $validated['course_id'],
            ],
            [
                'status' => $validated['status'],
                'enrolled_at' => now(),
            ]
        );

        return redirect()->back()->with('success', 'Student successfully enrolled into the course.');
    }
}
