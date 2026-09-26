<?php

namespace App\Http\Controllers\Admin;

use App\Events\CourseContentAddedEvent;
use App\Http\Controllers\Controller;
use App\Jobs\UploadLessonNotes;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\Instructor;
use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

        $query = Course::with([
            'category',
            'instructor.user',
            'enrollments' => function ($q) {
                $q->with('user:id,name,email,phone,status')->latest('enrolled_at');
            },
        ])->withCount('enrollments');

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
        $students = User::where('role', 'student')->where('status', 'active')->orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'students' => $students,
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
            'capstones' => ['nullable', 'array'],
            'capstones.*.title' => ['nullable', 'string', 'max:255'],
            'capstones.*.desc' => ['nullable', 'string', 'max:1000'],
            'capstones.*.stack' => ['nullable', 'string', 'max:255'],
            'thumbnail_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:5120'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'duration' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'in:live,recorded'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published,archived'],
            'batches' => ['nullable', 'array'],
            'batches.*.id' => ['nullable', 'integer'],
            'batches.*.batch_name' => ['required_with:batches', 'string', 'max:255'],
            'batches.*.time_slot' => ['required_with:batches', 'string', 'max:255'],
            'batches.*.days' => ['nullable', 'string', 'max:255'],
            'batches.*.capacity' => ['nullable', 'integer', 'min:1'],
            'batches.*.is_active' => ['nullable', 'boolean'],
        ]);

        if (($validated['type'] ?? 'recorded') === 'live' && empty($validated['batches'])) {
            return back()->withErrors(['batches' => 'Live courses require at least one batch timing (e.g. 09:00 AM - 10:00 AM).'])->withInput();
        }

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

        $course = Course::create([
            'category_id' => $validated['category_id'],
            'instructor_id' => $validated['instructor_id'] ?? null,
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'curriculum' => $validated['curriculum'] ?? null,
            'course_includes' => $validated['course_includes'] ?? null,
            'capstones' => $validated['capstones'] ?? null,
            'thumbnail' => $thumbnailUrl,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'type' => $validated['type'] ?? 'recorded',
            'is_featured' => $isFeatured,
            'status' => $validated['status'],
        ]);

        if (! empty($validated['batches'])) {
            foreach ($validated['batches'] as $b) {
                if (! empty($b['time_slot'])) {
                    $course->batches()->create([
                        'batch_name' => ! empty($b['batch_name']) ? $b['batch_name'] : 'Batch 1',
                        'time_slot' => $b['time_slot'],
                        'days' => $b['days'] ?? 'Monday - Friday',
                        'capacity' => ! empty($b['capacity']) ? (int) $b['capacity'] : null,
                        'is_active' => isset($b['is_active']) ? (bool) $b['is_active'] : true,
                    ]);
                }
            }
        }

        return redirect()->route('admin.courses.index')->with('success', 'Course created successfully.');
    }

    // Display / edit form for a single course
    public function show(Course $course): Response
    {
        $course->load(['category', 'instructor.user', 'batches']);
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
            'capstones' => ['nullable', 'array'],
            'capstones.*.title' => ['nullable', 'string', 'max:255'],
            'capstones.*.desc' => ['nullable', 'string', 'max:1000'],
            'capstones.*.stack' => ['nullable', 'string', 'max:255'],
            'thumbnail_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg,gif', 'max:5120'],
            'thumbnail' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'duration' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', 'in:live,recorded'],
            'is_featured' => ['boolean'],
            'status' => ['required', 'in:draft,published,archived'],
            'batches' => ['nullable', 'array'],
            'batches.*.id' => ['nullable', 'integer'],
            'batches.*.batch_name' => ['required_with:batches', 'string', 'max:255'],
            'batches.*.time_slot' => ['required_with:batches', 'string', 'max:255'],
            'batches.*.days' => ['nullable', 'string', 'max:255'],
            'batches.*.capacity' => ['nullable', 'integer', 'min:1'],
            'batches.*.is_active' => ['nullable', 'boolean'],
        ]);

        if (($validated['type'] ?? 'recorded') === 'live' && empty($validated['batches'])) {
            return back()->withErrors(['batches' => 'Live courses require at least one batch timing (e.g. 09:00 AM - 10:00 AM).'])->withInput();
        }

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
            'capstones' => $validated['capstones'] ?? null,
            'thumbnail' => $thumbnailUrl,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'type' => $validated['type'] ?? 'recorded',
            'is_featured' => $isFeatured,
            'status' => $validated['status'],
        ]);

        // Sync batches
        if (isset($validated['batches'])) {
            $submittedBatchIds = [];
            foreach ($validated['batches'] as $b) {
                if (empty($b['time_slot'])) {
                    continue;
                }
                if (! empty($b['id'])) {
                    $existing = $course->batches()->where('id', $b['id'])->first();
                    if ($existing) {
                        $existing->update([
                            'batch_name' => ! empty($b['batch_name']) ? $b['batch_name'] : 'Batch 1',
                            'time_slot' => $b['time_slot'],
                            'days' => $b['days'] ?? 'Monday - Friday',
                            'capacity' => ! empty($b['capacity']) ? (int) $b['capacity'] : null,
                            'is_active' => isset($b['is_active']) ? (bool) $b['is_active'] : true,
                        ]);
                        $submittedBatchIds[] = $existing->id;

                        continue;
                    }
                }

                $created = $course->batches()->create([
                    'batch_name' => ! empty($b['batch_name']) ? $b['batch_name'] : 'Batch 1',
                    'time_slot' => $b['time_slot'],
                    'days' => $b['days'] ?? 'Monday - Friday',
                    'capacity' => ! empty($b['capacity']) ? (int) $b['capacity'] : null,
                    'is_active' => isset($b['is_active']) ? (bool) $b['is_active'] : true,
                ]);
                $submittedBatchIds[] = $created->id;
            }

            $course->batches()->whereNotIn('id', $submittedBatchIds)->delete();
        }

        return redirect()->route('admin.courses.index')->with('success', 'Course details updated successfully.');
    }

    // Delete specified course
    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();

        return redirect()->route('admin.courses.index')->with('success', 'Course deleted successfully.');
    }

    // Course Content & Lessons Management Page
    public function content(Course $course): Response
    {
        $course->load([
            'category:id,name',
            'instructor.user:id,name',
            'modules' => fn ($q) => $q->orderBy('sort_order')->with([
                'lessons' => fn ($lq) => $lq->orderBy('sort_order')->with(['videos', 'resources']),
            ]),
            'lessons' => fn ($q) => $q->with(['videos', 'resources']),
            'liveClasses' => fn ($q) => $q->orderBy('start_time'),
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
            'video_file' => [
                'nullable',
                'file',
                'mimetypes:video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo',
                'max:102400',
            ],
            'duration' => ['nullable', 'string', 'max:50'],
            'notes_file' => ['nullable', 'file', 'max:51200'],
            'notes_title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order' => ['nullable', 'integer'],
        ]);

        $moduleName = trim($validated['module_name']);
        $module = CourseModule::firstOrCreate(
            ['course_id' => $course->id, 'title' => $moduleName],
            ['sort_order' => ($course->modules()->max('sort_order') ?? 0) + 1]
        );
        $wasNewModule = $module->wasRecentlyCreated;

        $maxSortOrder = $module->lessons()->max('sort_order') ?? 0;
        $sortOrder = $validated['order'] ?? ($maxSortOrder + 1);

        $lesson = $module->lessons()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'sort_order' => $sortOrder,
            'status' => 'published',
        ]);

        // Handle direct video file upload or external URL
        if ($request->hasFile('video_file')) {
            $videoFile = $request->file('video_file');
            $durationSeconds = $this->parseDurationToSeconds($validated['duration'] ?? null);

            try {
                if (config('services.imagekit.private_key')) {
                    $upload = $imageKit->upload($videoFile, '/courses/videos');
                    $videoUrl = $upload['url'];
                    $storageKey = $upload['fileId'] ?? null;
                    $provider = 'imagekit';
                } else {
                    $path = $videoFile->store('courses/videos', 'public');
                    $videoUrl = Storage::url($path);
                    $storageKey = $path;
                    $provider = 'local';
                }

                $lesson->videos()->create([
                    'title' => $validated['title'],
                    'video_url' => $videoUrl,
                    'storage_key' => $storageKey,
                    'duration_seconds' => $durationSeconds,
                    'file_size' => $videoFile->getSize(),
                    'video_provider' => $provider,
                    'status' => 'ready',
                ]);
            } catch (Throwable $e) {
                return back()->withErrors(['video_file' => 'Video upload failed: '.$e->getMessage()])->withInput();
            }
        } elseif (! empty($validated['video_url'])) {
            $durationSeconds = $this->parseDurationToSeconds($validated['duration'] ?? null);

            $lesson->videos()->create([
                'title' => $validated['title'],
                'video_url' => $validated['video_url'],
                'duration_seconds' => $durationSeconds,
                'video_provider' => 'url',
                'status' => 'ready',
            ]);
        }

        if ($request->hasFile('notes_file')) {
            $file = $request->file('notes_file');
            $extension = strtolower($file->getClientOriginalExtension());
            $resourceType = in_array($extension, ['pdf', 'doc', 'docx']) ? 'pdf' : (in_array($extension, ['png', 'jpg', 'jpeg', 'webp']) ? 'image' : (in_array($extension, ['zip', 'rar', 'tar', 'gz']) ? 'archive' : 'code'));

            UploadLessonNotes::dispatch(
                $lesson,
                base64_encode($file->get()),
                $file->getClientOriginalName(),
                $validated['notes_title'] ?: 'Lecture Notes & Material',
                [
                    'resource_type' => $resourceType,
                    'mime_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                    'sort_order' => 1,
                ]
            );
        }

        // Notify all active enrolled students about the new module/lesson
        $enrolledStudents = $course->students()->wherePivot('status', 'active')->get();
        CourseContentAddedEvent::dispatchSafely($course, $module, $lesson, $wasNewModule, $enrolledStudents);

        return back()->with('success', 'Lesson with video and notes added successfully.');
    }

    // Update an existing lesson
    public function updateLesson(Request $request, Course $course, CourseLesson $lesson, ImageKitService $imageKit): RedirectResponse
    {
        $validated = $request->validate([
            'module_name' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'video_url' => ['nullable', 'string', 'max:1000'],
            'video_file' => [
                'nullable',
                'file',
                'mimetypes:video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo',
                'max:102400',
            ],
            'duration' => ['nullable', 'string', 'max:50'],
            'notes_file' => ['nullable', 'file', 'max:51200'],
            'notes_title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order' => ['nullable', 'integer'],
        ]);

        $moduleName = trim($validated['module_name']);
        if ($lesson->module?->title !== $moduleName) {
            $module = CourseModule::firstOrCreate(
                ['course_id' => $course->id, 'title' => $moduleName],
                ['sort_order' => ($course->modules()->max('sort_order') ?? 0) + 1]
            );
            $lesson->module_id = $module->id;
        }

        $lesson->title = $validated['title'];
        $lesson->description = $validated['description'] ?? null;
        if (isset($validated['order'])) {
            $lesson->sort_order = $validated['order'];
        }
        $lesson->save();

        // Handle video updates (direct upload vs URL)
        if ($request->hasFile('video_file')) {
            $videoFile = $request->file('video_file');
            $durationSeconds = $this->parseDurationToSeconds($validated['duration'] ?? null);

            try {
                $video = $lesson->videos()->first();
                if ($video && $video->storage_key) {
                    if ($video->video_provider === 'imagekit') {
                        $imageKit->deleteFile($video->storage_key);
                    } elseif ($video->video_provider === 'local') {
                        Storage::disk('public')->delete($video->storage_key);
                    }
                }

                if (config('services.imagekit.private_key')) {
                    $upload = $imageKit->upload($videoFile, '/courses/videos');
                    $videoUrl = $upload['url'];
                    $storageKey = $upload['fileId'] ?? null;
                    $provider = 'imagekit';
                } else {
                    $path = $videoFile->store('courses/videos', 'public');
                    $videoUrl = Storage::url($path);
                    $storageKey = $path;
                    $provider = 'local';
                }

                if ($video) {
                    $video->update([
                        'title' => $validated['title'],
                        'video_url' => $videoUrl,
                        'storage_key' => $storageKey,
                        'duration_seconds' => $durationSeconds,
                        'file_size' => $videoFile->getSize(),
                        'video_provider' => $provider,
                        'status' => 'ready',
                    ]);
                } else {
                    $lesson->videos()->create([
                        'title' => $validated['title'],
                        'video_url' => $videoUrl,
                        'storage_key' => $storageKey,
                        'duration_seconds' => $durationSeconds,
                        'file_size' => $videoFile->getSize(),
                        'video_provider' => $provider,
                        'status' => 'ready',
                    ]);
                }
            } catch (Throwable $e) {
                return back()->withErrors(['video_file' => 'Video upload failed: '.$e->getMessage()])->withInput();
            }
        } elseif (! empty($validated['video_url'])) {
            $durationSeconds = $this->parseDurationToSeconds($validated['duration'] ?? null);

            $video = $lesson->videos()->first();
            if ($video) {
                // If replacing an uploaded video with an external URL, remove old file from storage
                if ($video->storage_key && $video->video_url !== $validated['video_url']) {
                    if ($video->video_provider === 'imagekit') {
                        $imageKit->deleteFile($video->storage_key);
                    } elseif ($video->video_provider === 'local') {
                        Storage::disk('public')->delete($video->storage_key);
                    }
                    $video->storage_key = null;
                    $video->file_size = null;
                    $video->video_provider = 'url';
                }

                $video->update([
                    'title' => $validated['title'],
                    'video_url' => $validated['video_url'],
                    'duration_seconds' => $durationSeconds,
                    'storage_key' => $video->storage_key,
                    'video_provider' => $video->video_provider ?? 'url',
                    'file_size' => $video->file_size,
                ]);
            } else {
                $lesson->videos()->create([
                    'title' => $validated['title'],
                    'video_url' => $validated['video_url'],
                    'duration_seconds' => $durationSeconds,
                    'video_provider' => 'url',
                    'status' => 'ready',
                ]);
            }
        }

        // Handle notes resource
        if ($request->hasFile('notes_file')) {
            $file = $request->file('notes_file');
            $extension = strtolower($file->getClientOriginalExtension());
            $resourceType = in_array($extension, ['pdf', 'doc', 'docx']) ? 'pdf' : (in_array($extension, ['png', 'jpg', 'jpeg', 'webp']) ? 'image' : (in_array($extension, ['zip', 'rar', 'tar', 'gz']) ? 'archive' : 'code'));

            UploadLessonNotes::dispatch(
                $lesson,
                base64_encode($file->get()),
                $file->getClientOriginalName(),
                $validated['notes_title'] ?: 'Lecture Notes & Material',
                [
                    'resource_type' => $resourceType,
                    'mime_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                    'sort_order' => ($lesson->resources()->max('sort_order') ?? 0) + 1,
                ]
            );
        } elseif (! empty($validated['notes_title'])) {
            $firstResource = $lesson->resources()->first();
            if ($firstResource) {
                $firstResource->update(['title' => $validated['notes_title']]);
            }
        }

        return back()->with('success', 'Lesson updated successfully.');
    }

    // Delete a lesson
    public function destroyLesson(Course $course, CourseLesson $lesson, ImageKitService $imageKit): RedirectResponse
    {
        foreach ($lesson->videos as $video) {
            if ($video->storage_key) {
                if ($video->video_provider === 'imagekit') {
                    $imageKit->deleteFile($video->storage_key);
                } elseif ($video->video_provider === 'local') {
                    Storage::disk('public')->delete($video->storage_key);
                }
            }
        }

        $lesson->delete();

        return back()->with('success', 'Lesson deleted successfully.');
    }

    // Helper to parse human string duration to integer seconds
    private function parseDurationToSeconds(?string $duration): ?int
    {
        if (empty($duration)) {
            return null;
        }

        $duration = trim($duration);

        if (is_numeric($duration)) {
            return (int) $duration;
        }

        if (preg_match('/^(\d+):(\d+)$/', $duration, $m)) {
            return ((int) $m[1] * 60) + (int) $m[2];
        }

        if (preg_match('/^(\d+):(\d+):(\d+)$/', $duration, $m)) {
            return ((int) $m[1] * 3600) + ((int) $m[2] * 60) + (int) $m[3];
        }

        $seconds = 0;
        $matched = false;

        if (preg_match('/(\d+)\s*(?:h|hr|hrs|hour|hours)/i', $duration, $m)) {
            $seconds += (int) $m[1] * 3600;
            $matched = true;
        }

        if (preg_match('/(\d+)\s*(?:m|min|mins|minute|minutes)/i', $duration, $m)) {
            $seconds += (int) $m[1] * 60;
            $matched = true;
        }

        if (preg_match('/(\d+)\s*(?:s|sec|secs|second|seconds)/i', $duration, $m)) {
            $seconds += (int) $m[1];
            $matched = true;
        }

        return $matched ? $seconds : null;
    }
}
