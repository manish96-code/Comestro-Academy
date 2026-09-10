<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
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
        $enrolledCoursesCount = $user->enrollments()->where('status', 'active')->count();
        $recentEnrollments = $user->enrollments()
            ->with(['course.category', 'course.instructor.user'])
            ->latest('enrolled_at')
            ->take(3)
            ->get();

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
            'enrolledCoursesCount' => $enrolledCoursesCount,
            'recentEnrollments' => $recentEnrollments,
        ]);
    }

    // Display list of published courses for students to browse and enroll
    public function courses(Request $request): Response
    {
        $user = $request->user();
        $search = $request->query('search');
        $categoryId = $request->query('category_id');

        $query = Course::query()
            ->where('status', 'published')
            ->with(['category', 'instructor.user']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('instructor.user', function ($iq) use ($search) {
                        $iq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        $courses = $query->latest()->paginate(9)->withQueryString();

        $enrolledCourseIds = $user ? $user->enrollments()->pluck('course_id')->toArray() : [];

        $courses->through(function ($course) use ($enrolledCourseIds) {
            $course->is_enrolled = in_array($course->id, $enrolledCourseIds, true);

            return $course;
        });

        $categories = Category::where('status', 'active')->get(['id', 'name']);

        return Inertia::render('Student/Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId,
            ],
        ]);
    }

    // Display single course view / detail page (accessible with or without login)
    public function showCourse(Request $request, string $slug): Response
    {
        $user = $request->user();

        $course = Course::where('slug', $slug)
            ->orWhere('id', $slug)
            ->with(['category', 'instructor.user', 'lessons'])
            ->withCount(['enrollments' => function ($q) {
                $q->where('status', 'active');
            }])
            ->firstOrFail();

        // If course is draft or archived, only admin or instructor can view
        if ($course->status !== 'published') {
            if (! $user || (! $user->isAdmin() && ! $user->isInstructor())) {
                abort(404);
            }
        }

        $isEnrolled = false;
        if ($user) {
            $isEnrolled = $user->enrollments()
                ->where('course_id', $course->id)
                ->where('status', 'active')
                ->exists();
        }

        $course->is_enrolled = $isEnrolled;

        // Fetch related courses
        $relatedCourses = Course::where('status', 'published')
            ->where('id', '!=', $course->id)
            ->where('category_id', $course->category_id)
            ->with(['category', 'instructor.user'])
            ->take(3)
            ->get();

        if ($relatedCourses->isEmpty()) {
            $relatedCourses = Course::where('status', 'published')
                ->where('id', '!=', $course->id)
                ->with(['category', 'instructor.user'])
                ->take(3)
                ->get();
        }

        return Inertia::render('Student/Courses/Show', [
            'course' => $course,
            'relatedCourses' => $relatedCourses,
        ]);
    }

    // Display courses the student has enrolled in
    public function enrolledCourses(Request $request): Response
    {
        $user = $request->user();

        $enrollments = $user->enrollments()
            ->with(['course.category', 'course.instructor.user'])
            ->latest('enrolled_at')
            ->paginate(9);

        return Inertia::render('Student/Courses/Enrolled', [
            'enrollments' => $enrollments,
        ]);
    }

    // Enroll the authenticated student in a course
    public function enroll(Request $request, Course $course): RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login')->with('error', 'Please log in to enroll in this course.');
        }

        if ($course->status !== 'published') {
            return redirect()->back()->with('error', 'This course is currently not open for enrollment.');
        }

        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existingEnrollment) {
            return redirect()->back()->with('error', 'You are already enrolled in this course.');
        }

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now(),
        ]);

        return redirect()->back()->with('success', "Congratulations! You have successfully enrolled in {$course->title}.");
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
