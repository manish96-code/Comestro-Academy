<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\Instructor;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    // Run the database seeds.
    public function run(): void
    {
        $webDev = Category::where('slug', 'web-development')->first();
        $laravel = Category::where('slug', 'laravel-framework')->first();
        $uiux = Category::where('slug', 'ui-ux-design')->first();
        $instructor = Instructor::first();

        if ($laravel && $instructor) {
            Course::create([
                'category_id' => $laravel->id,
                'instructor_id' => $instructor->id,
                'title' => 'Master Full-Stack Laravel 12 & Inertia React',
                'slug' => 'master-full-stack-laravel-12-inertia-react',
                'description' => 'Comprehensive masterclass building production-ready SaaS applications with modern Laravel, Inertia, and React.',
                'thumbnail' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
                'price' => 4999.00,
                'discount_price' => 2999.00,
                'duration' => '12 Weeks',
                'is_featured' => true,
                'status' => 'published',
            ]);
        }

        if ($webDev && $instructor) {
            Course::create([
                'category_id' => $webDev->id,
                'instructor_id' => $instructor->id,
                'title' => 'Complete Modern Web Development: Zero to Pro',
                'slug' => 'complete-modern-web-development-zero-to-pro',
                'description' => 'Learn HTML5, modern CSS, JavaScript ES6+, backend databases, and modern deployment pipelines.',
                'thumbnail' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
                'price' => 3499.00,
                'discount_price' => 1999.00,
                'duration' => '8 Weeks',
                'is_featured' => true,
                'status' => 'published',
            ]);
        }

        if ($uiux) {
            Course::create([
                'category_id' => $uiux->id,
                'instructor_id' => $instructor?->id,
                'title' => 'UI/UX Design Systems & Prototyping in Figma',
                'slug' => 'ui-ux-design-systems-prototyping-figma',
                'description' => 'From wireframing to high-fidelity responsive prototypes and scalable design systems for modern digital products.',
                'thumbnail' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
                'price' => 2999.00,
                'discount_price' => null,
                'duration' => '6 Weeks',
                'is_featured' => false,
                'status' => 'draft',
            ]);
        }
    }
}
