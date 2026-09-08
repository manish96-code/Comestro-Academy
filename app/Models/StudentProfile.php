<?php

namespace App\Models;

use Database\Factories\StudentProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    /** @use HasFactory<StudentProfileFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'qualification',
        'college_name',
        'bio',
        'github_url',
        'linkedin_url',
        'city',
        'state',
    ];

    // Associated user account
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
