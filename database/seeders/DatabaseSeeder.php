<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Manish Kumar',
            'email' => 'manish@gmail.com',
            'phone' => '7987878900',
            'password' => Hash::make('123456789'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        $instructor = User::create([
            'name' => 'Dr. Rajesh Sharma',
            'email' => 'rajesh@example.com',
            'phone' => '9876543210',
            'password' => Hash::make('123456789'),
            'role' => 'instructor',
            'status' => 'active',
        ]);

        $instructor->instructorProfile()->create([
            'designation' => 'Senior Web Instructor',
            'qualification' => 'M.Tech in Computer Science',
            'expertise' => 'PHP, Laravel, React, MySQL',
            'experience_years' => 7,
            'bio' => 'Passionate instructor with over 7 years of teaching experience.',
        ]);

        User::create([
            'name' => 'Rahul Verma',
            'email' => 'rahul@example.com',
            'phone' => '8887776665',
            'password' => Hash::make('123456789'),
            'role' => 'student',
            'status' => 'active',
        ]);

        $webDev = Category::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
            'description' => 'Frontend & Backend web development courses covering HTML, CSS, JS, Laravel, React.',
            'status' => 'active',
        ]);

        Category::create([
            'name' => 'Laravel Framework',
            'slug' => 'laravel-framework',
            'description' => 'Master full-stack Laravel framework architecture, APIs, and Inertia React.',
            'parent_id' => $webDev->id,
            'status' => 'active',
        ]);

        Category::create([
            'name' => 'UI/UX & Graphic Design',
            'slug' => 'ui-ux-design',
            'description' => 'User interface design, prototyping with Figma, and visual aesthetics.',
            'status' => 'active',
        ]);
    }
}
