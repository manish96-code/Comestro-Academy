<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseLesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'module_name',
        'title',
        'order',
        'video_url',
        'duration',
        'is_free_preview',
        'notes_file',
        'notes_title',
        'description',
    ];

    protected $casts = [
        'is_free_preview' => 'boolean',
        'order' => 'integer',
    ];

    // Course relationship
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
