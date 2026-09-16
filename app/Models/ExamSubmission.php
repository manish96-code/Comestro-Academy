<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_exam_id',
        'user_id',
        'started_at',
        'submitted_at',
        'score',
        'total_marks',
        'percentage',
        'is_passed',
        'answers',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'score' => 'integer',
        'total_marks' => 'integer',
        'percentage' => 'integer',
        'is_passed' => 'boolean',
        'answers' => 'array',
    ];

    public function exam(): BelongsTo
    {
        return $this->belongsTo(CourseExam::class, 'course_exam_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
