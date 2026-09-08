<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
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
    Route::patch('/courses/{course}', [CourseController::class, 'update'])->name('courses.update');
});

Route::middleware(['auth', 'verified'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/auth.php';
