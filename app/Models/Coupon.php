<?php

namespace App\Models;

use Database\Factories\CouponFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    /** @use HasFactory<CouponFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_type',
        'discount_value',
        'max_discount_amount',
        'min_order_amount',
        'max_uses',
        'max_uses_per_user',
        'used_count',
        'starts_at',
        'expires_at',
        'is_active',
        'applies_to_all_courses',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'discount_value' => 'decimal:2',
            'max_discount_amount' => 'decimal:2',
            'min_order_amount' => 'decimal:2',
            'max_uses' => 'integer',
            'max_uses_per_user' => 'integer',
            'used_count' => 'integer',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
            'applies_to_all_courses' => 'boolean',
        ];
    }

    /**
     * Set code always to uppercase and trimmed.
     */
    public function setCodeAttribute(string $value): void
    {
        $this->attributes['code'] = strtoupper(trim($value));
    }

    /**
     * Eligible courses relationship.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'coupon_courses')
            ->withTimestamps();
    }

    /**
     * Redemptions/usages relationship.
     */
    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    /**
     * Check if coupon validity has started.
     */
    public function hasStarted(): bool
    {
        return ! $this->starts_at || now()->gte($this->starts_at);
    }

    /**
     * Check if coupon has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && now()->gt($this->expires_at);
    }

    /**
     * Check if total redemptions exceeded max limit.
     */
    public function hasReachedMaxUses(): bool
    {
        return $this->max_uses !== null && $this->used_count >= $this->max_uses;
    }

    /**
     * Check if specific user has reached their usage limit.
     */
    public function hasReachedUserLimit(int $userId): bool
    {
        if (! $this->max_uses_per_user) {
            return false;
        }

        $userUsageCount = $this->usages()->where('user_id', $userId)->count();

        return $userUsageCount >= $this->max_uses_per_user;
    }

    /**
     * Check if coupon is applicable to a given course.
     */
    public function isApplicableToCourse(Course $course): bool
    {
        if ($this->applies_to_all_courses) {
            return true;
        }

        return $this->courses()->where('courses.id', $course->id)->exists();
    }

    /**
     * Calculate exact discount amount for a given original/effective price.
     */
    public function calculateDiscount(float $amount): float
    {
        if ($amount <= 0) {
            return 0.00;
        }

        if ($this->discount_type === 'percentage') {
            $discount = round(($amount * (float) $this->discount_value) / 100, 2);

            if ($this->max_discount_amount !== null && (float) $this->max_discount_amount > 0) {
                $discount = min($discount, (float) $this->max_discount_amount);
            }

            return min($discount, $amount);
        }

        // Fixed discount
        $fixedDiscount = (float) $this->discount_value;

        return min($fixedDiscount, $amount);
    }
}
