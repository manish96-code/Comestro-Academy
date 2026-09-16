<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_exam_id',
        'question_text',
        'question_type',
        'points',
        'explanation',
        'sort_order',
    ];

    protected $casts = [
        'points' => 'integer',
        'sort_order' => 'integer',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(CourseExam::class, 'course_exam_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(ExamQuestionOption::class)->orderBy('sort_order');
    }
}
