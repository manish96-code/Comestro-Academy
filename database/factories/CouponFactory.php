<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Coupon>
 */
class CouponFactory extends Factory
{
    protected $model = Coupon::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(Str::random(8)),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'discount_type' => 'percentage',
            'discount_value' => 20.00,
            'max_discount_amount' => 1000.00,
            'min_order_amount' => 500.00,
            'max_uses' => 100,
            'max_uses_per_user' => 1,
            'used_count' => 0,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addMonth(),
            'is_active' => true,
            'applies_to_all_courses' => true,
        ];
    }

    public function fixed(float $amount = 500.00): static
    {
        return $this->state(fn () => [
            'discount_type' => 'fixed',
            'discount_value' => $amount,
            'max_discount_amount' => null,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'starts_at' => now()->subMonths(2),
            'expires_at' => now()->subDay(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }

    public function fullyRedeemed(): static
    {
        return $this->state(fn () => [
            'max_uses' => 5,
            'used_count' => 5,
        ]);
    }
}
