<?php

namespace Database\Factories;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Certificate>
 */
class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $year = date('Y');
        $random = strtoupper(Str::random(6));

        return [
            'certificate_number' => "CA-{$year}-{$random}",
            'uuid' => (string) Str::uuid(),
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'enrollment_id' => null,
            'issued_at' => now(),
            'final_score' => 88.50,
            'metadata' => [
                'student_name' => fake()->name(),
                'course_title' => fake()->sentence(3),
                'instructor_name' => 'Comestro Faculty Team',
                'course_duration' => '10 Weeks',
                'total_lessons' => 12,
                'exams_count' => 1,
                'assignments_count' => 1,
            ],
            'status' => 'active',
        ];
    }
}
