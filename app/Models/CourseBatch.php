<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'batch_name',
        'time_slot',
        'days',
        'capacity',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'capacity' => 'integer',
    ];

    // Course relationship
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // Enrollments in this batch
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'batch_id');
    }
}
