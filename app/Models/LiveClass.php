<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LiveClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'instructor_id',
        'lesson_id',
        'title',
        'description',
        'meeting_link',
        'start_time',
        'end_time',
        'duration_minutes',
        'recording_url',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(Instructor::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(CourseLesson::class, 'lesson_id');
    }
}
