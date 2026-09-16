<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'batch_id',
        'status',
        'enrolled_at',
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
    ];

    // User relationship
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Course relationship
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // Batch relationship (for live courses)
    public function batch(): BelongsTo
    {
        return $this->belongsTo(CourseBatch::class, 'batch_id');
    }

    // Immutable Invoice relationship
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }
}
