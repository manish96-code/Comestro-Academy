<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    // Display a list of courses
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $status = $request->query('status');

        $query = Course::with(['category', 'instructor.user']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('instructor.user', function ($iq) use ($search) {
                        $iq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $courses = $query->latest()->paginate(10)->withQueryString();

        $categories = Category::where('status', 'active')->get(['id', 'name']);

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId,
                'status' => $status,
            ],
        ]);
    }

    // Show form to create a new course
    public function create(): Response
    {
        $categories = Category::where('status', 'active')->get(['id', 'name']);
        $instructors = Instructor::whereHas('user', function ($q) {
            $q->where('status', 'active');
        })->with('user:id,name,email,status')->get();

        return Inertia::render('Admin/Courses/Create', [
            'categories' => $categories,
            'instructors' => $instructors,
        ]);
    }

    // Store a newly created course
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'instructor_id' => [
                'nullable',
                Rule::exists('instructors', 'id')->where(function ($q) {
                    $q->whereIn('user_id', User::where('status', 'active')->select('id'));
                }),
            ],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'duration' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $count = 1;

        while (Course::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $isFeatured = $validated['status'] === 'published' && ($validated['is_featured'] ?? false);

        Course::create([
            'category_id' => $validated['category_id'],
            'instructor_id' => $validated['instructor_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'is_featured' => $isFeatured,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.courses.index')->with('success', 'Course created successfully.');
    }

    // Display / edit form for a single course
    public function show(Course $course): Response
    {
        $course->load(['category', 'instructor.user']);
        $categories = Category::where('status', 'active')->get(['id', 'name']);

        $instructors = Instructor::whereHas('user', function ($q) {
            $q->where('status', 'active');
        })
            ->when($course->instructor_id, function ($q) use ($course) {
                $q->orWhere('id', $course->instructor_id);
            })
            ->with('user:id,name,email,status')
            ->get();

        return Inertia::render('Admin/Courses/Create', [
            'course' => $course,
            'categories' => $categories,
            'instructors' => $instructors,
        ]);
    }

    // Update specified course
    public function update(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'instructor_id' => [
                'nullable',
                Rule::exists('instructors', 'id')->where(function ($q) use ($course) {
                    $q->whereIn('user_id', User::where('status', 'active')->select('id'))
                        ->when($course->instructor_id, fn ($query) => $query->orWhere('id', $course->instructor_id));
                }),
            ],
            'description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'duration' => ['nullable', 'string', 'max:100'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $count = 1;

        while (Course::where('slug', $slug)->where('id', '!=', $course->id)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $isFeatured = $validated['status'] === 'published' && ($validated['is_featured'] ?? false);

        $course->update([
            'category_id' => $validated['category_id'],
            'instructor_id' => $validated['instructor_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'is_featured' => $isFeatured,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.courses.index')->with('success', 'Course details updated successfully.');
    }
}
