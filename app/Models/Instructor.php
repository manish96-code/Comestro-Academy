<?php

namespace App\Models;

use Database\Factories\InstructorFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Instructor extends Model
{
    /** @use HasFactory<InstructorFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'designation',
        'qualification',
        'expertise',
        'experience_years',
        'bio',
        'social_links',
    ];

    protected $casts = [
        'social_links' => 'array',
        'experience_years' => 'integer',
    ];

    // Get the associated user account.
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Courses taught by this instructor
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
