<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\CourseExamController as AdminCourseExamController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Student\CourseExamController as StudentCourseExamController;
use App\Http\Controllers\Student\InvoiceController;
use App\Http\Controllers\Student\PaymentController;
use App\Http\Controllers\Student\StudentController;
use App\Models\Course;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $courses = Course::with(['category', 'instructor.user'])
        ->where('status', 'published')
        ->orderByDesc('is_featured')
        ->latest()
        ->take(5)
        ->get()
        ->map(function ($course) {
            $instructorUser = $course->instructor?->user;
            $name = $instructorUser?->name ?? 'Comestro Faculty';
            $words = explode(' ', trim($name));
            $avatar = count($words) >= 2
                ? strtoupper(substr($words[0], 0, 1).substr(end($words), 0, 1))
                : strtoupper(substr($name, 0, 2));

            $priceFormatted = '₹'.number_format((float) ($course->discount_price > 0 ? $course->discount_price : $course->price));
            $originalPriceFormatted = $course->discount_price > 0 && $course->price > $course->discount_price
                ? '₹'.number_format((float) $course->price)
                : null;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'subtitle' => $course->subtitle,
                'category' => $course->category?->name ?? 'Engineering',
                'category_slug' => $course->category?->slug ?? '',
                'duration' => $course->duration ?: '10 Weeks',
                'level' => $course->type === 'live' ? 'Live Interactive' : ($course->type === 'recorded' ? 'Self-Paced' : ($course->type ?: 'All Levels')),
                'price' => $priceFormatted,
                'originalPrice' => $originalPriceFormatted,
                'rating' => '4.9'.($course->id % 9 + 1),
                'thumbnail' => $course->thumbnail,
                'instructor' => [
                    'name' => $name,
                    'role' => $course->instructor?->designation ?? 'Principal Engineer',
                    'avatar' => $avatar,
                ],
            ];
        });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'courses' => $courses,
    ]);
});

Route::get('/dashboard', function (Request $request) {
    $user = $request->user();

    if ($user->isAdmin() || $user->isInstructor()) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('student.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:admin,instructor'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/instructors', [AdminController::class, 'instructors'])->name('instructors.index');
    Route::get('/instructors/create', [AdminController::class, 'createInstructor'])->name('instructors.create');
    Route::post('/instructors', [AdminController::class, 'storeInstructor'])->name('instructors.store');
    Route::get('/instructors/{instructor}', [AdminController::class, 'showInstructor'])->name('instructors.show');
    Route::match(['patch', 'post'], '/instructors/{instructor}', [AdminController::class, 'updateInstructor'])->name('instructors.update');
    Route::delete('/instructors/{instructor}/profile-pic', [AdminController::class, 'destroyInstructorProfilePic'])->name('instructors.profile-pic.destroy');

    Route::get('/students', [AdminController::class, 'students'])->name('students.index');
    Route::get('/students/{student}', [AdminController::class, 'showStudent'])->name('students.show');
    Route::patch('/students/{student}', [AdminController::class, 'updateStudent'])->name('students.update');
    Route::post('/students/{student}/enrollments', [AdminController::class, 'enrollStudent'])->name('students.enrollments.store');

    Route::post('/enrollments', [AdminController::class, 'storeEnrollment'])->name('enrollments.store');
    Route::patch('/enrollments/{enrollment}', [AdminController::class, 'updateEnrollment'])->name('enrollments.update');
    Route::delete('/enrollments/{enrollment}', [AdminController::class, 'destroyEnrollment'])->name('enrollments.destroy');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::match(['patch', 'post'], '/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])->name('courses.destroy');
    Route::get('/courses/{course}/content', [CourseController::class, 'content'])->name('courses.content');
    Route::post('/courses/{course}/lessons', [CourseController::class, 'storeLesson'])->name('courses.lessons.store');
    Route::post('/courses/{course}/lessons/{lesson}', [CourseController::class, 'updateLesson'])->name('courses.lessons.update');
    Route::delete('/courses/{course}/lessons/{lesson}', [CourseController::class, 'destroyLesson'])->name('courses.lessons.destroy');
    Route::get('/courses/{course}/exam', [AdminCourseExamController::class, 'show'])->name('courses.exam.show');
    Route::post('/courses/{course}/exam', [AdminCourseExamController::class, 'saveSettings'])->name('courses.exam.save');
    Route::post('/courses/{course}/exam/questions', [AdminCourseExamController::class, 'storeQuestion'])->name('courses.exam.questions.store');
    Route::delete('/courses/{course}/exam/questions/{question}', [AdminCourseExamController::class, 'deleteQuestion'])->name('courses.exam.questions.destroy');
    Route::get('/exams', [AdminCourseExamController::class, 'index'])->name('exams.index');
});

// Public Course Catalog & Detail Page
Route::get('/courses', [StudentController::class, 'courses'])->name('courses.index');
Route::get('/courses/{slug}', [StudentController::class, 'showCourse'])->name('courses.show');
Route::get('/student/courses', [StudentController::class, 'courses'])->name('student.courses.index');
Route::post('/courses/{course}/enroll', [StudentController::class, 'enroll'])->name('courses.enroll');

Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
    Route::get('/enrolled-courses', [StudentController::class, 'enrolledCourses'])->name('courses.enrolled');
    Route::get('/courses/{course}/learn', [StudentController::class, 'learn'])->name('courses.learn');
    Route::post('/courses/{course}/lessons/{lesson}/toggle-complete', [StudentController::class, 'toggleLessonComplete'])->name('courses.lessons.toggle-complete');
    Route::get('/exams', [StudentCourseExamController::class, 'index'])->name('exams.index');
    Route::get('/courses/{course}/exam', [StudentCourseExamController::class, 'show'])->name('courses.exam.show');
    Route::post('/courses/{course}/exam/submit', [StudentCourseExamController::class, 'submit'])->name('courses.exam.submit');
    Route::post('/courses/{course}/enroll', [StudentController::class, 'enroll'])->name('courses.enroll');
    Route::get('/profile', [StudentController::class, 'profile'])->name('profile');
    Route::match(['post', 'patch'], '/profile', [StudentController::class, 'updateProfile'])->name('profile.update');
    Route::delete('/profile/pic', [StudentController::class, 'destroyProfilePic'])->name('profile.pic.destroy');
    Route::put('/profile/password', [StudentController::class, 'updatePassword'])->name('profile.password');

    // Invoices / Receipts
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/{enrollment}', [InvoiceController::class, 'show'])->name('invoices.show');
});

// Unified Notification Management Routes (Admin & Student)
Route::middleware(['auth', 'verified'])->prefix('notifications')->name('notifications.')->group(function () {
    Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
    Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('readAll');
    Route::delete('/clear', [NotificationController::class, 'clear'])->name('clear');
});

// Razorpay Course Enrollment Payment Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/courses/{course}/payment/create-order', [PaymentController::class, 'createOrder'])->name('courses.payment.create-order');
    Route::post('/courses/{course}/payment/verify', [PaymentController::class, 'verifyPayment'])->name('courses.payment.verify');
});

require __DIR__.'/auth.php';
