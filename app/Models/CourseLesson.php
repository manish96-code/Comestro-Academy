<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CourseLesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'title',
        'description',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'module_name',
        'video_url',
        'video_provider',
        'video_status',
        'duration',
        'notes_file',
        'notes_title',
        'order',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(CourseModule::class, 'module_id');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(LessonVideo::class, 'lesson_id');
    }

    public function primaryVideo(): HasOne
    {
        return $this->hasOne(LessonVideo::class, 'lesson_id')->latestOfMany();
    }

    public function resources(): HasMany
    {
        return $this->hasMany(LessonResource::class, 'lesson_id')->orderBy('sort_order');
    }

    public function liveClasses(): HasMany
    {
        return $this->hasMany(LiveClass::class, 'lesson_id');
    }

    public function completions(): HasMany
    {
        return $this->hasMany(LessonCompletion::class, 'lesson_id');
    }

    // Backward-compatibility accessors
    protected function moduleName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->module?->title ?? ''
        );
    }

    protected function videoUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                $url = $this->videos->first()?->video_url;
                if ($url && str_contains($url, 'ik.imagekit.io') && ! str_contains($url, 'tr=')) {
                    return str_contains($url, '?') ? "{$url}&tr=orig" : "{$url}?tr=orig";
                }

                return $url;
            }
        );
    }

    protected function videoProvider(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->videos->first()?->video_provider ?? 'url'
        );
    }

    protected function videoStatus(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->videos->first()?->status ?? 'ready'
        );
    }

    protected function duration(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->videos->first()?->formatted_duration
        );
    }

    protected function notesFile(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->resources->first()?->file_url
        );
    }

    protected function notesTitle(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->resources->first()?->title
        );
    }

    protected function order(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sort_order,
            set: fn ($value) => ['sort_order' => $value]
        );
    }
}
