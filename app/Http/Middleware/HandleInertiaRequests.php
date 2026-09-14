<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'admin_notifications' => fn () => $request->user()?->isAdmin()
                ? $request->user()->notifications()->latest()->take(30)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'studentName' => $n->data['student_name'] ?? 'Student',
                    'profilePic' => $n->data['profile_pic'] ?? null,
                    'courseId' => $n->data['course_id'] ?? null,
                    'courseTitle' => $n->data['course_title'] ?? 'Course',
                    'enrolledAt' => $n->data['enrolled_at'] ?? $n->created_at?->toIso8601String(),
                    'read' => $n->read_at !== null,
                ])->values()->all()
                : [],
            'student_notifications' => fn () => $request->user()?->isStudent()
                ? $request->user()->notifications()->latest()->take(30)->get()->map(fn ($n) => [
                    'id' => $n->id,
                    'type' => $n->data['type'] ?? 'lesson_added',
                    'courseId' => $n->data['course_id'] ?? null,
                    'courseTitle' => $n->data['course_title'] ?? 'Course',
                    'courseSlug' => $n->data['course_slug'] ?? null,
                    'moduleId' => $n->data['module_id'] ?? null,
                    'moduleName' => $n->data['module_name'] ?? null,
                    'lessonId' => $n->data['lesson_id'] ?? null,
                    'lessonTitle' => $n->data['lesson_title'] ?? null,
                    'isNewModule' => (bool) ($n->data['is_new_module'] ?? false),
                    'message' => $n->data['message'] ?? 'New content added to your enrolled course',
                    'addedAt' => $n->data['added_at'] ?? $n->created_at?->toIso8601String(),
                    'read' => $n->read_at !== null,
                ])->values()->all()
                : [],
        ];
    }
}
