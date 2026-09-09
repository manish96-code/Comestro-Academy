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
            Course::updateOrCreate(
                ['slug' => 'master-full-stack-laravel-12-inertia-react'],
                [
                    'category_id' => $laravel->id,
                    'instructor_id' => $instructor->id,
                    'title' => 'Master Full-Stack Laravel 12 & Inertia React',
                    'subtitle' => 'Architect enterprise-grade SaaS web applications with robust APIs, reactive frontend SPAs, and automated testing.',
                    'description' => "This course is a complete, hands-on walkthrough of building modern production-grade web applications using Laravel 12, Inertia.js v2, and React 19.\n\nIt starts from architectural fundamentals, covering clean domain-driven patterns, advanced database schemas, Eloquent ORM relationships, and scalable REST API resources.\n\nAs the course progresses, it transitions into building reactive Single Page Applications with Inertia.js, eliminating complex API client boilerplate while enjoying the full reactivity of React components, deferred props, and instant navigation.\n\nBy the end, you will build and deploy a comprehensive real-world SaaS capstone application complete with payment processing, role authorization, automated Pest tests, and production Docker deployment.",
                    'curriculum' => [
                        [
                            'title' => 'Modern Laravel 12 Core Architecture & APIs',
                            'subtitle' => 'Routing & Controllers, Form Requests & Validation, Eloquent ORM & Query Scopes, API Resources & Transformations',
                        ],
                        [
                            'title' => 'Reactive Frontends with Inertia.js v2 & React 19',
                            'subtitle' => 'Inertia SPA Lifecycle, Shared Props & Layouts, Form Handling & Optimistic UI, Deferred Props & Infinite Scroll',
                        ],
                        [
                            'title' => 'Authentication, RBAC & Security Boundaries',
                            'subtitle' => 'Multi-Guard Authentication, Role-Based Access Control, Policies & Gates, Rate Limiting & CSRF Shield',
                        ],
                        [
                            'title' => 'Background Jobs, Queues & Scheduled Tasks',
                            'subtitle' => 'Redis Queue Workers, Job Chaining & Batches, Asynchronous Notifications, Scheduled Crons & Maintenance',
                        ],
                        [
                            'title' => 'Automated Testing with Pest & Production Deployment',
                            'subtitle' => 'Unit & Feature Tests with Pest PHP, HTTP Endpoint Testing, Docker Containerization, CI/CD Deployment Pipelines',
                        ],
                    ],
                    'thumbnail' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
                    'price' => 4999.00,
                    'discount_price' => 2999.00,
                    'duration' => '12 Weeks',
                    'course_includes' => [
                        '12 Weeks of intensive training',
                        'Real-world capstone project codebases',
                        'Downloadable starter kits & slide decks',
                        'Direct mentor Q&A and code reviews',
                        'Official Certificate of Completion',
                        'Full lifetime access on mobile & web',
                    ],
                    'is_featured' => true,
                    'status' => 'published',
                ]
            );
        }

        if ($webDev && $instructor) {
            Course::updateOrCreate(
                ['slug' => 'complete-modern-web-development-zero-to-pro'],
                [
                    'category_id' => $webDev->id,
                    'instructor_id' => $instructor->id,
                    'title' => 'Complete Modern Web Development: Zero to Pro',
                    'subtitle' => 'Master HTML5, modern CSS, JavaScript ES6+, relational SQL databases, and cloud deployment pipelines.',
                    'description' => "This course is a complete, hands-on walkthrough of building modern websites using HTML, CSS, and Tailwind CSS. It starts from the core structure of the web, covering how HTML elements form the backbone of every page, then moves into styling systems using CSS, including layout techniques like Flexbox and Grid, spacing, positioning, and responsive design principles.\n\nAs the course progresses, it transitions into Tailwind CSS, focusing on utility-first workflows, rapid UI development, and how to replace traditional CSS patterns with scalable, maintainable design systems. You will work through real interface sections such as navigation bars, hero sections, cards, forms, and full-page layouts, all built step by step.\n\nThe course includes practical builds that simulate real-world frontend development, showing how to structure files, organize styles, and create reusable components. It also demonstrates how to make websites responsive across different devices, ensuring consistency in design and behavior.\n\nBy the end, the course contains multiple fully built website interfaces, combining HTML structure, CSS fundamentals, and Tailwind efficiency into a cohesive development workflow.",
                    'curriculum' => [
                        [
                            'title' => 'HTML Fundamentals',
                            'subtitle' => 'Introduction to HTML, HTML Document Structure, Module 1 Assessment, Create Your First HTML Page',
                        ],
                        [
                            'title' => 'CSS Fundamentals',
                            'subtitle' => 'Box Model & Margin Collapse, CSS Selectors & Specificity, Colors, Fonts & Typography, Modern CSS Variables',
                        ],
                        [
                            'title' => 'Responsive Design',
                            'subtitle' => 'Mobile-First Philosophy, Media Queries & Breakpoints, Responsive Images & Typography, Fluid Layouts',
                        ],
                        [
                            'title' => 'Tailwind CSS Mastery',
                            'subtitle' => 'Utility-First Mindset, Setup & Configuration, Layout & Spacing Utilities, Flexbox & Grid with Tailwind',
                        ],
                        [
                            'title' => 'Capstone Website Build & Deployment',
                            'subtitle' => 'End-to-End Modern Website Project, Cross-Browser Testing, Performance Audit & SEO, Live Production Deployment',
                        ],
                    ],
                    'thumbnail' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
                    'price' => 3499.00,
                    'discount_price' => 1999.00,
                    'duration' => '8 Weeks',
                    'course_includes' => [
                        '8 Weeks of structured step-by-step training',
                        'Hands-on responsive web projects & live codebases',
                        'Downloadable UI templates, CSS cheat sheets & assets',
                        'Instructor feedback & personalized code reviews',
                        'Official Certificate of Completion',
                        'Full lifetime access on mobile & web',
                    ],
                    'is_featured' => true,
                    'status' => 'published',
                ]
            );
        }

        if ($uiux) {
            Course::updateOrCreate(
                ['slug' => 'ui-ux-design-systems-prototyping-figma'],
                [
                    'category_id' => $uiux->id,
                    'instructor_id' => $instructor?->id,
                    'title' => 'UI/UX Design Systems & Prototyping in Figma',
                    'subtitle' => 'From wireframing to high-fidelity responsive prototypes and scalable design systems for modern digital products.',
                    'description' => "Learn modern digital product design from wireframing to interactive prototyping and component design systems.\n\nMaster industry-standard workflows in Figma, typography hierarchy, user psychology, accessibility standards, and seamless developer handoff.",
                    'curriculum' => [
                        [
                            'title' => 'Design Thinking & Wireframing',
                            'subtitle' => 'User Personas & Journey Mapping, Low-Fidelity Wireframes, Information Architecture & User Flows',
                        ],
                        [
                            'title' => 'Figma Mastery & Auto-Layout',
                            'subtitle' => 'Frames & Responsive Constraints, Auto-Layout 5.0, Component Variants, Interactive Component States',
                        ],
                        [
                            'title' => 'Scalable Design Systems & Prototyping',
                            'subtitle' => 'Color & Typography Tokens, Icon Systems, High-Fidelity Interactive Prototyping, Developer Handoff',
                        ],
                    ],
                    'thumbnail' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60',
                    'price' => 2999.00,
                    'discount_price' => null,
                    'duration' => '6 Weeks',
                    'course_includes' => [
                        '6 Weeks of hands-on Figma design sprints',
                        'Production UI kits, design tokens & component libraries',
                        'Interactive clickable prototypes & usability tests',
                        'Portfolio review & design critique sessions',
                        'Official Certificate of Completion',
                        'Full lifetime access on mobile & web',
                    ],
                    'is_featured' => false,
                    'status' => 'draft',
                ]
            );
        }
    }
}
