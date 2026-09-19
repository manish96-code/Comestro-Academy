<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseExam extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'duration_minutes',
        'marks_per_question',
        'passing_percentage',
        'is_published',
        'sort_order',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'marks_per_question' => 'integer',
        'passing_percentage' => 'integer',
        'is_published' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ExamQuestion::class)->orderBy('sort_order');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ExamSubmission::class);
    }
}
