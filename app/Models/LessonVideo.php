<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonVideo extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'video_url',
        'storage_key',
        'duration_seconds',
        'file_size',
        'thumbnail',
        'video_provider',
        'status',
    ];

    protected $casts = [
        'duration_seconds' => 'integer',
        'file_size' => 'integer',
    ];

    protected $appends = [
        'formatted_duration',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(CourseLesson::class, 'lesson_id');
    }

    protected function formattedDuration(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->duration_seconds === null) {
                    return null;
                }

                $hours = floor($this->duration_seconds / 3600);
                $minutes = floor(($this->duration_seconds % 3600) / 60);
                $seconds = $this->duration_seconds % 60;

                if ($hours > 0) {
                    return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
                }

                return sprintf('%02d:%02d', $minutes, $seconds);
            }
        );
    }
}
