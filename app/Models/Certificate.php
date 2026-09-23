<?php

namespace App\Models;

use Database\Factories\CertificateFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Certificate extends Model
{
    /** @use HasFactory<CertificateFactory> */
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'uuid',
        'user_id',
        'course_id',
        'enrollment_id',
        'issued_at',
        'final_score',
        'metadata',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
            'final_score' => 'decimal:2',
            'metadata' => 'array',
        ];
    }

    // Boot model and generate UUID and certificate number if missing.
    protected static function booted(): void
    {
        static::creating(function (Certificate $certificate) {
            if (empty($certificate->uuid)) {
                $certificate->uuid = (string) Str::uuid();
            }

            if (empty($certificate->certificate_number)) {
                $year = date('Y');
                $random = strtoupper(Str::random(6));
                $certificate->certificate_number = "CA-{$year}-{$random}";
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function isValid(): bool
    {
        return $this->status === 'active';
    }

    public function getPublicVerificationUrlAttribute(): string
    {
        return route('certificates.verify', $this->certificate_number);
    }
}
