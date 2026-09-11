<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'file_url',
        'storage_key',
        'resource_type',
        'mime_type',
        'file_size',
        'external_url',
        'sort_order',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'formatted_file_size',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(CourseLesson::class, 'lesson_id');
    }

    protected function formattedFileSize(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->file_size) {
                    return null;
                }

                $bytes = $this->file_size;
                $units = ['B', 'KB', 'MB', 'GB'];
                $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
                $pow = min($pow, count($units) - 1);

                $bytes /= pow(1024, $pow);

                return round($bytes, 2).' '.$units[$pow];
            }
        );
    }
}
