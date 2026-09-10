<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\Instructor;
use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

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
    public function store(Request $request, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'instructor_id' => [
                'nullable',
                Rule::exists('instructors', 'id')->where(function ($q) {
                    $q->whereIn('user_id', User::where('status', 'active')->select('id'));
                }),
            ],
            'description' => ['nullable', 'string'],
            'curriculum' => ['nullable', 'array'],
            'curriculum.*.title' => ['required_with:curriculum', 'string', 'max:255'],
            'curriculum.*.subtitle' => ['nullable', 'string', 'max:1000'],
            'curriculum.*.subtitles' => ['nullable', 'array'],
            'curriculum.*.subtitles.*' => ['nullable', 'string', 'max:500'],
            'course_includes' => ['nullable', 'array'],
            'course_includes.*' => ['nullable', 'string', 'max:500'],
            'thumbnail_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:5120'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'duration' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'in:live,recorded'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $thumbnailUrl = $validated['thumbnail'] ?? null;

        if ($request->hasFile('thumbnail_image')) {
            try {
                $upload = $imageKit->upload($request->file('thumbnail_image'), '/courses');
                $thumbnailUrl = $upload['url'];
            } catch (Throwable $e) {
                return back()->withErrors(['thumbnail_image' => 'Image upload failed: '.$e->getMessage()])->withInput();
            }
        }

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
            'subtitle' => $validated['subtitle'] ?? null,
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'curriculum' => $validated['curriculum'] ?? null,
            'course_includes' => $validated['course_includes'] ?? null,
            'thumbnail' => $thumbnailUrl,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'type' => $validated['type'] ?? 'recorded',
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
    public function update(Request $request, Course $course, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'instructor_id' => [
                'nullable',
                Rule::exists('instructors', 'id')->where(function ($q) use ($course) {
                    $q->whereIn('user_id', User::where('status', 'active')->select('id'))
                        ->when($course->instructor_id, fn ($query) => $query->orWhere('id', $course->instructor_id));
                }),
            ],
            'description' => ['nullable', 'string'],
            'curriculum' => ['nullable', 'array'],
            'curriculum.*.title' => ['required_with:curriculum', 'string', 'max:255'],
            'curriculum.*.subtitle' => ['nullable', 'string', 'max:1000'],
            'curriculum.*.subtitles' => ['nullable', 'array'],
            'curriculum.*.subtitles.*' => ['nullable', 'string', 'max:500'],
            'course_includes' => ['nullable', 'array'],
            'course_includes.*' => ['nullable', 'string', 'max:500'],
            'thumbnail_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:5120'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'duration' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'in:live,recorded'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published,archived'],
        ]);

        $thumbnailUrl = $validated['thumbnail'] ?? $course->thumbnail;

        if ($request->hasFile('thumbnail_image')) {
            try {
                $upload = $imageKit->upload($request->file('thumbnail_image'), '/courses');
                $thumbnailUrl = $upload['url'];
            } catch (Throwable $e) {
                return back()->withErrors(['thumbnail_image' => 'Image upload failed: '.$e->getMessage()])->withInput();
            }
        }

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
            'subtitle' => $validated['subtitle'] ?? null,
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'curriculum' => $validated['curriculum'] ?? null,
            'course_includes' => $validated['course_includes'] ?? null,
            'thumbnail' => $thumbnailUrl,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'type' => $validated['type'] ?? 'recorded',
            'is_featured' => $isFeatured,
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.courses.index')->with('success', 'Course details updated successfully.');
    }

    // Course Content & Lessons Management Page
    public function content(Course $course): Response
    {
        $course->load([
            'category:id,name',
            'instructor.user:id,name',
            'lessons' => fn ($q) => $q->orderBy('order')->orderBy('id'),
        ]);

        return Inertia::render('Admin/Courses/Content', [
            'course' => $course,
        ]);
    }

    // Store a new lesson / video lecture with notes
    public function storeLesson(Request $request, Course $course, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'module_name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'video_url' => ['nullable', 'string', 'max:1000'],
            'duration' => ['nullable', 'string', 'max:50'],
            'notes_file' => ['nullable', 'file', 'max:51200'],
            'notes_title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_free_preview' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $notesUrl = null;
        if ($request->hasFile('notes_file')) {
            try {
                $upload = $imageKit->upload($request->file('notes_file'), '/courses/notes');
                $notesUrl = $upload['url'];
            } catch (Throwable $e) {
                return back()->withErrors(['notes_file' => 'Failed to upload notes: '.$e->getMessage()])->withInput();
            }
        }

        $maxOrder = $course->lessons()->max('order') ?? 0;

        $course->lessons()->create([
            'module_name' => $validated['module_name'],
            'title' => $validated['title'],
            'video_url' => $validated['video_url'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'notes_file' => $notesUrl,
            'notes_title' => $validated['notes_title'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_free_preview' => $validated['is_free_preview'] ?? false,
            'order' => $validated['order'] ?? ($maxOrder + 1),
        ]);

        return back()->with('success', 'Lesson with video and notes added successfully.');
    }

    // Update an existing lesson
    public function updateLesson(Request $request, Course $course, CourseLesson $lesson, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'module_name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'video_url' => ['nullable', 'string', 'max:1000'],
            'duration' => ['nullable', 'string', 'max:50'],
            'notes_file' => ['nullable', 'file', 'max:51200'],
            'notes_title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_free_preview' => ['boolean'],
            'order' => ['nullable', 'integer'],
        ]);

        $notesUrl = $lesson->notes_file;
        if ($request->hasFile('notes_file')) {
            try {
                $upload = $imageKit->upload($request->file('notes_file'), '/courses/notes');
                $notesUrl = $upload['url'];
            } catch (Throwable $e) {
                return back()->withErrors(['notes_file' => 'Failed to upload notes: '.$e->getMessage()])->withInput();
            }
        }

        $lesson->update([
            'module_name' => $validated['module_name'],
            'title' => $validated['title'],
            'video_url' => $validated['video_url'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'notes_file' => $notesUrl,
            'notes_title' => $validated['notes_title'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_free_preview' => $validated['is_free_preview'] ?? false,
            'order' => $validated['order'] ?? $lesson->order,
        ]);

        return back()->with('success', 'Lesson updated successfully.');
    }

    // Delete a lesson
    public function destroyLesson(Course $course, CourseLesson $lesson): RedirectResponse
    {
        $lesson->delete();

        return back()->with('success', 'Lesson deleted successfully.');
    }
}
