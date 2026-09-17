<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_assignment_id',
        'user_id',
        'submission_text',
        'file_path',
        'file_name',
        'github_url',
        'submitted_at',
        'is_late',
        'status',
        'marks_obtained',
        'feedback',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'is_late' => 'boolean',
        'marks_obtained' => 'integer',
    ];

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(CourseAssignment::class, 'course_assignment_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function getIsPassedAttribute(): ?bool
    {
        if ($this->marks_obtained === null) {
            return null;
        }

        $passing = $this->assignment?->passing_marks ?? 40;

        return $this->marks_obtained >= $passing;
    }
}
