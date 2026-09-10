<?php

namespace App\Models;

use Database\Factories\CourseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    /** @use HasFactory<CourseFactory> */
    use HasFactory;

    protected $fillable = [
        'category_id',
        'instructor_id',
        'title',
        'subtitle',
        'slug',
        'description',
        'curriculum',
        'course_includes',
        'thumbnail',
        'price',
        'discount_price',
        'duration',
        'type',
        'is_featured',
        'status',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'curriculum' => 'array',
        'course_includes' => 'array',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
    ];

    // Category relationship
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Instructor relationship
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class);
    }

    // Enrollments relationship
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    // Students relationship
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot(['status', 'enrolled_at'])
            ->withTimestamps();
    }

    // Payments relationship
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Lessons (Videos & Notes) relationship
    public function lessons(): HasMany
    {
        return $this->hasMany(CourseLesson::class)->orderBy('order');
    }
}
