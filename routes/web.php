<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
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
    Route::patch('/instructors/{instructor}', [AdminController::class, 'updateInstructor'])->name('instructors.update');

    Route::get('/students', [AdminController::class, 'students'])->name('students.index');
    Route::get('/students/{student}', [AdminController::class, 'showStudent'])->name('students.show');
    Route::patch('/students/{student}', [AdminController::class, 'updateStudent'])->name('students.update');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');

    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/courses/create', [CourseController::class, 'create'])->name('courses.create');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    Route::match(['patch', 'post'], '/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
});

// Public Course Catalog & Detail Page
Route::get('/courses', [StudentController::class, 'courses'])->name('courses.index');
Route::get('/courses/{slug}', [StudentController::class, 'showCourse'])->name('courses.show');
Route::get('/student/courses', [StudentController::class, 'courses'])->name('student.courses.index');
Route::post('/courses/{course}/enroll', [StudentController::class, 'enroll'])->name('courses.enroll');

Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
    Route::get('/enrolled-courses', [StudentController::class, 'enrolledCourses'])->name('courses.enrolled');
    Route::post('/courses/{course}/enroll', [StudentController::class, 'enroll'])->name('courses.enroll');
    Route::get('/profile', [StudentController::class, 'profile'])->name('profile');
    Route::patch('/profile', [StudentController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/password', [StudentController::class, 'updatePassword'])->name('profile.password');
});

require __DIR__ . '/auth.php';
