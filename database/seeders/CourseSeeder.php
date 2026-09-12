<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\Enrollment;
use App\Models\Instructor;
use App\Models\LessonResource;
use App\Models\LessonVideo;
use App\Models\LiveClass;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $webDev = Category::where('slug', 'web-development')->first();
        $laravel = Category::where('slug', 'laravel-framework')->first();
        $uiux = Category::where('slug', 'ui-ux-design')->first();
        $cloudDevops = Category::where('slug', 'cloud-devops')->first();
        $mobileDev = Category::where('slug', 'mobile-development')->first();
        $pythonAi = Category::where('slug', 'python-ai')->first();

        $instructor1 = Instructor::whereHas('user', fn ($q) => $q->where('email', 'rajesh@example.com'))->first()
            ?? Instructor::first();
        $instructor2 = Instructor::whereHas('user', fn ($q) => $q->where('email', 'priya@example.com'))->first()
            ?? $instructor1;
        $instructor3 = Instructor::whereHas('user', fn ($q) => $q->where('email', 'amitav.roy@example.com'))->first()
            ?? $instructor1;
        $instructor4 = Instructor::whereHas('user', fn ($q) => $q->where('email', 'ananya.gupta@example.com'))->first()
            ?? $instructor1;
        $instructor5 = Instructor::whereHas('user', fn ($q) => $q->where('email', 'vikram.sengupta@example.com'))->first()
            ?? $instructor1;

        $student = User::where('email', 'rahul@example.com')->first();
        $admin = User::where('email', 'manish@gmail.com')->first();

        // -------------------------------------------------------------
        // COURSE 1: Master Full-Stack Laravel 12 & Inertia React
        // -------------------------------------------------------------
        if ($laravel && $instructor1) {
            $course1 = Course::updateOrCreate(
                ['slug' => 'master-full-stack-laravel-12-inertia-react'],
                [
                    'category_id' => $laravel->id,
                    'instructor_id' => $instructor1->id,
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
                    'type' => 'recorded',
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

            // Module 1: Architecture, Routing & Service Containers
            $m1 = CourseModule::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Module 1: Architecture, Routing & Service Containers'],
                [
                    'description' => 'Deep-dive into Laravel 12 application foundation, lifecycle, and service container architecture.',
                    'sort_order' => 1,
                ]
            );

            $l1_1 = CourseLesson::updateOrCreate(
                ['module_id' => $m1->id, 'title' => 'Introduction to Laravel 12 & Modern Directory Structure'],
                [
                    'description' => 'Comprehensive walkthrough of Laravel 12 folder layout, environment configuration, and booting lifecycle.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l1_1->id],
                [
                    'title' => 'Introduction to Laravel 12 & Directory Structure',
                    'video_url' => 'https://www.youtube.com/watch?v=MYyJ4PuL4pY',
                    'duration_seconds' => 780,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l1_1->id, 'title' => 'Laravel 12 Architecture Guide & Cheatsheet (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 2450000,
                    'sort_order' => 1,
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l1_1->id, 'title' => 'Starter Project Repository & Config Setup'],
                [
                    'resource_type' => 'code',
                    'file_url' => 'https://github.com/laravel/laravel',
                    'mime_type' => 'application/zip',
                    'file_size' => 154000,
                    'sort_order' => 2,
                ]
            );

            $l1_2 = CourseLesson::updateOrCreate(
                ['module_id' => $m1->id, 'title' => 'Service Containers, Dependency Injection & Contracts'],
                [
                    'description' => 'Understanding contextual binding, singletons, interface contracts, and automated dependency injection.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l1_2->id],
                [
                    'title' => 'Service Containers & Dependency Injection',
                    'video_url' => 'https://www.youtube.com/watch?v=2enfrj6w9mU',
                    'duration_seconds' => 1140,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l1_2->id, 'title' => 'Dependency Injection Patterns & Code Samples (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 1890000,
                    'sort_order' => 1,
                ]
            );

            $l1_3 = CourseLesson::updateOrCreate(
                ['module_id' => $m1->id, 'title' => 'Advanced Routing, Middleware & Rate Limiting Shields'],
                [
                    'description' => 'Route caching, custom route constraints, model binding, pipeline middleware, and rate limiters.',
                    'sort_order' => 3,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l1_3->id],
                [
                    'title' => 'Advanced Routing & Middleware Pipelines',
                    'video_url' => 'https://www.youtube.com/watch?v=rIfdg_Ot-LI',
                    'duration_seconds' => 960,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Module 2: Eloquent ORM & Database Relationships
            $m2 = CourseModule::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Module 2: Eloquent ORM, Advanced Schema & Database Relationships'],
                [
                    'description' => 'Master complex database architectures, indexing strategies, and high-performance Eloquent queries.',
                    'sort_order' => 2,
                ]
            );

            $l2_1 = CourseLesson::updateOrCreate(
                ['module_id' => $m2->id, 'title' => 'Schema Design, Foreign Keys & Composite Indexing'],
                [
                    'description' => 'Relational database normalization, constraints, composite indexes, and query execution plan optimization.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l2_1->id],
                [
                    'title' => 'Schema Design & Composite Indexing',
                    'video_url' => 'https://www.youtube.com/watch?v=kYJzphq6X-U',
                    'duration_seconds' => 1080,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l2_1->id, 'title' => 'Database Normalization & Indexing Principles (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 3200000,
                    'sort_order' => 1,
                ]
            );

            $l2_2 = CourseLesson::updateOrCreate(
                ['module_id' => $m2->id, 'title' => 'Eloquent Relationships: HasManyThrough, MorphTo & Eager Loading'],
                [
                    'description' => 'Building complex relational models, polymorphism, subquery selections, and preventing N+1 bottlenecks.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l2_2->id],
                [
                    'title' => 'Eloquent Relationships & Eager Loading',
                    'video_url' => 'https://www.youtube.com/watch?v=345rO02kE6g',
                    'duration_seconds' => 1420,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l2_2->id, 'title' => 'Eloquent Relationship Cheat Sheet & Code Samples'],
                [
                    'resource_type' => 'code',
                    'file_url' => 'https://github.com/laravel/framework',
                    'mime_type' => 'text/plain',
                    'file_size' => 450000,
                    'sort_order' => 1,
                ]
            );

            $l2_3 = CourseLesson::updateOrCreate(
                ['module_id' => $m2->id, 'title' => 'Query Scopes, Custom Casts & Attribute Mutators'],
                [
                    'description' => 'Leveraging clean query scopes, immutable Value Objects with custom casts, and modern attribute accessors.',
                    'sort_order' => 3,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l2_3->id],
                [
                    'title' => 'Query Scopes & Attribute Mutators',
                    'video_url' => 'https://www.youtube.com/watch?v=b0_hD758F_s',
                    'duration_seconds' => 880,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Module 3: Reactive Full-Stack with Inertia.js v2 & React 19
            $m3 = CourseModule::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Module 3: Reactive Full-Stack with Inertia.js v2 & React 19'],
                [
                    'description' => 'Construct seamless Single Page Applications without API complexity using Inertia v2 and modern React 19.',
                    'sort_order' => 3,
                ]
            );

            $l3_1 = CourseLesson::updateOrCreate(
                ['module_id' => $m3->id, 'title' => 'Inertia.js v2 Core Architecture & React 19 Integration'],
                [
                    'description' => 'Shared layout architecture, page props pipeline, client-side routing, and zero-latency page transitions.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l3_1->id],
                [
                    'title' => 'Inertia.js v2 Core Architecture & React 19',
                    'video_url' => 'https://www.youtube.com/watch?v=v0_fEa08f5o',
                    'duration_seconds' => 1250,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l3_1->id, 'title' => 'Inertia v2 & React 19 Boilerplate Template'],
                [
                    'resource_type' => 'code',
                    'file_url' => 'https://github.com/inertiajs/inertia',
                    'mime_type' => 'application/zip',
                    'file_size' => 890000,
                    'sort_order' => 1,
                ]
            );

            $l3_2 = CourseLesson::updateOrCreate(
                ['module_id' => $m3->id, 'title' => 'Form Submissions, Validation Errors & Optimistic Updates'],
                [
                    'description' => 'Building resilient forms with useForm helper, server-side validation binding, and instantaneous UI updates.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l3_2->id],
                [
                    'title' => 'Form Submissions & Validation Errors',
                    'video_url' => 'https://www.youtube.com/watch?v=zT1s5lP2y8Q',
                    'duration_seconds' => 1350,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            $l3_3 = CourseLesson::updateOrCreate(
                ['module_id' => $m3->id, 'title' => 'Deferred Props, Polling, Infinite Scroll & Prefetching'],
                [
                    'description' => 'Unleashing cutting-edge Inertia v2 capabilities: deferred props with skeletons, smart polling, and link prefetching.',
                    'sort_order' => 3,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l3_3->id],
                [
                    'title' => 'Deferred Props, Polling & Infinite Scrolling',
                    'video_url' => 'https://www.youtube.com/watch?v=yW6b3_q4JpU',
                    'duration_seconds' => 1190,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l3_3->id, 'title' => 'Inertia v2 Deferred Props Guide & Code Notes (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 1650000,
                    'sort_order' => 1,
                ]
            );

            // Module 4: Payments, Automated Testing with Pest & Docker Deploy
            $m4 = CourseModule::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Module 4: Payments, Automated Testing with Pest & Docker Deploy'],
                [
                    'description' => 'Payment gateway integration, unit & feature testing with Pest PHP, and production cloud containerization.',
                    'sort_order' => 4,
                ]
            );

            $l4_1 = CourseLesson::updateOrCreate(
                ['module_id' => $m4->id, 'title' => 'Integrating Razorpay Gateway & Webhook Verification'],
                [
                    'description' => 'Implementing Razorpay order creation, client checkout modal, and secure HMAC SHA256 signature verification.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l4_1->id],
                [
                    'title' => 'Razorpay Gateway & Webhook Signature Verification',
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'duration_seconds' => 1560,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l4_1->id, 'title' => 'Razorpay Webhook Handler Reference Code (PHP)'],
                [
                    'resource_type' => 'code',
                    'file_url' => 'https://github.com/razorpay/razorpay-php',
                    'mime_type' => 'text/plain',
                    'file_size' => 78000,
                    'sort_order' => 1,
                ]
            );

            $l4_2 = CourseLesson::updateOrCreate(
                ['module_id' => $m4->id, 'title' => 'Writing Comprehensive Feature Tests with Pest PHP'],
                [
                    'description' => 'Design clean, readable, high-speed automated Pest tests covering authentication, transactions, and API routes.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l4_2->id],
                [
                    'title' => 'Automated Feature Testing with Pest PHP',
                    'video_url' => 'https://www.youtube.com/watch?v=Jm08Qy4b6dE',
                    'duration_seconds' => 1300,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $l4_2->id, 'title' => 'Complete Pest PHP Test Suite Examples (ZIP)'],
                [
                    'resource_type' => 'code',
                    'file_url' => 'https://pestphp.com',
                    'mime_type' => 'application/zip',
                    'file_size' => 320000,
                    'sort_order' => 1,
                ]
            );

            $l4_3 = CourseLesson::updateOrCreate(
                ['module_id' => $m4->id, 'title' => 'Production Docker Multi-Stage Builds & Cloud Deploy'],
                [
                    'description' => 'Containerizing Laravel and React with PHP-FPM, Nginx, OPcache optimization, and zero-downtime CI/CD deployment.',
                    'sort_order' => 3,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $l4_3->id],
                [
                    'title' => 'Production Docker Builds & Cloud Deployment',
                    'video_url' => 'https://www.youtube.com/watch?v=gT8c8nB8Q7s',
                    'duration_seconds' => 1440,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Live Classes for Course 1
            LiveClass::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Live Architecture Review & Capstone Q&A Session'],
                [
                    'instructor_id' => $instructor1->id,
                    'lesson_id' => $l4_1->id,
                    'description' => 'Interactive live architecture breakdown, reviewing student capstone repositories, and answering scaling questions.',
                    'meeting_link' => 'https://meet.google.com/com-estr-oac',
                    'start_time' => Carbon::now()->addDays(3)->setTime(18, 0, 0),
                    'end_time' => Carbon::now()->addDays(3)->setTime(19, 30, 0),
                    'duration_minutes' => 90,
                    'status' => 'scheduled',
                ]
            );

            LiveClass::updateOrCreate(
                ['course_id' => $course1->id, 'title' => 'Recorded: SaaS Architecture Workshop & Code Walkthrough'],
                [
                    'instructor_id' => $instructor1->id,
                    'lesson_id' => $l1_1->id,
                    'description' => 'Recording of our live introductory masterclass covering system architecture and domain models.',
                    'recording_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                    'start_time' => Carbon::now()->subDays(4)->setTime(19, 0, 0),
                    'end_time' => Carbon::now()->subDays(4)->setTime(20, 15, 0),
                    'duration_minutes' => 75,
                    'status' => 'completed',
                ]
            );
        }

        // -------------------------------------------------------------
        // COURSE 2: Complete Modern Web Development: Zero to Pro
        // -------------------------------------------------------------
        if ($webDev && $instructor1) {
            $course2 = Course::updateOrCreate(
                ['slug' => 'complete-modern-web-development-zero-to-pro'],
                [
                    'category_id' => $webDev->id,
                    'instructor_id' => $instructor1->id,
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
                    'type' => 'recorded',
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

            // Module 1: HTML5 Fundamentals
            $wm1 = CourseModule::updateOrCreate(
                ['course_id' => $course2->id, 'title' => 'Module 1: HTML5 Fundamentals & Semantic Web Standards'],
                [
                    'description' => 'Learn semantic HTML5 markup, accessibility best practices, and document structure.',
                    'sort_order' => 1,
                ]
            );

            $wl1_1 = CourseLesson::updateOrCreate(
                ['module_id' => $wm1->id, 'title' => 'Introduction to HTML5 & Semantic Web Structure'],
                [
                    'description' => 'Core elements, heading hierarchy, main, section, article, aside, and SEO markup.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl1_1->id],
                [
                    'title' => 'HTML5 Semantic Web Structure',
                    'video_url' => 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
                    'duration_seconds' => 920,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $wl1_1->id, 'title' => 'HTML5 Elements & Semantic Guide (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 1450000,
                    'sort_order' => 1,
                ]
            );

            $wl1_2 = CourseLesson::updateOrCreate(
                ['module_id' => $wm1->id, 'title' => 'Accessible Forms, Input Attributes & Validation'],
                [
                    'description' => 'Building accessible forms with labels, fieldsets, ARIA roles, and native client validation.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl1_2->id],
                [
                    'title' => 'Accessible Forms & ARIA Validation',
                    'video_url' => 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
                    'duration_seconds' => 1100,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Module 2: CSS3 Styling & Layout Systems
            $wm2 = CourseModule::updateOrCreate(
                ['course_id' => $course2->id, 'title' => 'Module 2: CSS3 Styling, Flexbox & Grid Systems'],
                [
                    'description' => 'Modern CSS layout mastery: Box Model, Flexbox positioning, CSS Grid, and responsive queries.',
                    'sort_order' => 2,
                ]
            );

            $wl2_1 = CourseLesson::updateOrCreate(
                ['module_id' => $wm2->id, 'title' => 'Box Model, Modern Selectors & Specificity Rules'],
                [
                    'description' => 'Understanding margin collapse, padding, borders, box-sizing, and cascade specificity calculation.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl2_1->id],
                [
                    'title' => 'CSS Box Model & Specificity Rules',
                    'video_url' => 'https://www.youtube.com/watch?v=1PnVor36_40',
                    'duration_seconds' => 1040,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $wl2_1->id, 'title' => 'CSS Box Model & Specificity Cheatsheet (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 2100000,
                    'sort_order' => 1,
                ]
            );

            $wl2_2 = CourseLesson::updateOrCreate(
                ['module_id' => $wm2->id, 'title' => 'Mastering Flexbox Alignment & Responsive Layouts'],
                [
                    'description' => 'Flex direction, wrap, justify-content, align-items, flex-grow, flex-shrink, and fluid card grids.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl2_2->id],
                [
                    'title' => 'Flexbox Layouts & Alignment Mastery',
                    'video_url' => 'https://www.youtube.com/watch?v=fYq5PXgSsbE',
                    'duration_seconds' => 1280,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            $wl2_3 = CourseLesson::updateOrCreate(
                ['module_id' => $wm2->id, 'title' => 'CSS Grid Architecture for Complex Web Apps'],
                [
                    'description' => 'Grid template areas, auto-fit, minmax(), repeat(), and complex multi-column responsive dashboard layouts.',
                    'sort_order' => 3,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl2_3->id],
                [
                    'title' => 'CSS Grid Architecture & Responsive Dashboards',
                    'video_url' => 'https://www.youtube.com/watch?v=jV8B24rSN5o',
                    'duration_seconds' => 1350,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Module 3: Tailwind CSS Rapid UI Development
            $wm3 = CourseModule::updateOrCreate(
                ['course_id' => $course2->id, 'title' => 'Module 3: Tailwind CSS 3/4 & Rapid UI Engineering'],
                [
                    'description' => 'Build modern, responsive, accessible interfaces in record time with utility-first Tailwind CSS.',
                    'sort_order' => 3,
                ]
            );

            $wl3_1 = CourseLesson::updateOrCreate(
                ['module_id' => $wm3->id, 'title' => 'Tailwind Setup, Utility Mindset & Theme Configuration'],
                [
                    'description' => 'Configuring custom color tokens, font stacks, spacing scales, and Vite asset compilation.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl3_1->id],
                [
                    'title' => 'Tailwind Setup & Theme Customization',
                    'video_url' => 'https://www.youtube.com/watch?v=UBOj6rqRUME',
                    'duration_seconds' => 1180,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $wl3_1->id, 'title' => 'Tailwind UI Component Starter Kit (ZIP)'],
                [
                    'resource_type' => 'code',
                    'file_url' => 'https://tailwindcss.com',
                    'mime_type' => 'application/zip',
                    'file_size' => 650000,
                    'sort_order' => 1,
                ]
            );

            $wl3_2 = CourseLesson::updateOrCreate(
                ['module_id' => $wm3->id, 'title' => 'Building Responsive Navbars, Hero Sections & Dark Mode'],
                [
                    'description' => 'Crafting modern hero sections, sticky navigation, interactive dropdowns, and automated dark theme toggles.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl3_2->id],
                [
                    'title' => 'Responsive Navbars & Dark Mode in Tailwind',
                    'video_url' => 'https://www.youtube.com/watch?v=pfaSUYaSgRo',
                    'duration_seconds' => 1420,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Module 4: JavaScript ES6+ & Cloud Deployment
            $wm4 = CourseModule::updateOrCreate(
                ['course_id' => $course2->id, 'title' => 'Module 4: Modern JavaScript ES6+ & Cloud Deployment'],
                [
                    'description' => 'Modern JavaScript essentials, asynchronous programming, APIs, and cloud deployment pipelines.',
                    'sort_order' => 4,
                ]
            );

            $wl4_1 = CourseLesson::updateOrCreate(
                ['module_id' => $wm4->id, 'title' => 'Modern ES6+ Syntax, Promises, Async/Await & Fetch'],
                [
                    'description' => 'Arrow functions, destructuring, spread/rest operators, modules, async/await, and consuming REST APIs.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl4_1->id],
                [
                    'title' => 'Modern JavaScript ES6+ & Async/Await',
                    'video_url' => 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                    'duration_seconds' => 1550,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $wl4_1->id, 'title' => 'JavaScript ES6+ Cheatsheet & Exercises (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 1980000,
                    'sort_order' => 1,
                ]
            );

            $wl4_2 = CourseLesson::updateOrCreate(
                ['module_id' => $wm4->id, 'title' => 'Deploying Responsive Websites to Vercel, Netlify & GitHub Pages'],
                [
                    'description' => 'Configuring custom domains, automated Git push deployments, SSL certificates, and performance audits with Lighthouse.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $wl4_2->id],
                [
                    'title' => 'Cloud Deployment to Vercel & Netlify',
                    'video_url' => 'https://www.youtube.com/watch?v=8A5kOqNqg6A',
                    'duration_seconds' => 890,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
        }

        // -------------------------------------------------------------
        // COURSE 3: UI/UX Design Systems & Prototyping in Figma
        // -------------------------------------------------------------
        if ($uiux && $instructor2) {
            $course3 = Course::updateOrCreate(
                ['slug' => 'ui-ux-design-systems-prototyping-figma'],
                [
                    'category_id' => $uiux->id,
                    'instructor_id' => $instructor2->id,
                    'title' => 'UI/UX Design Systems & Prototyping in Figma',
                    'subtitle' => 'From wireframing to high-fidelity responsive prototypes and scalable design systems for modern digital products.',
                    'description' => "Learn modern digital product design from wireframing to interactive prototyping and component design systems.\n\nMaster industry-standard workflows in Figma, typography hierarchy, user psychology, accessibility standards, and seamless developer handoff.\n\nThroughout the 6 weeks, you will build complete design systems with color and typography tokens, accessible contrast, auto-layout components, variant properties, and realistic micro-interactions.",
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
                    'discount_price' => 1799.00,
                    'duration' => '6 Weeks',
                    'type' => 'live',
                    'course_includes' => [
                        '6 Weeks of hands-on Figma design sprints',
                        'Production UI kits, design tokens & component libraries',
                        'Interactive clickable prototypes & usability tests',
                        'Portfolio review & design critique sessions',
                        'Official Certificate of Completion',
                        'Full lifetime access on mobile & web',
                    ],
                    'is_featured' => true,
                    'status' => 'published',
                ]
            );

            // Module 1: Design Thinking & Wireframing
            $um1 = CourseModule::updateOrCreate(
                ['course_id' => $course3->id, 'title' => 'Module 1: Design Thinking, User Research & Wireframing'],
                [
                    'description' => 'User research methodologies, empathy maps, user flows, and rapid paper/Figma wireframing.',
                    'sort_order' => 1,
                ]
            );

            $ul1_1 = CourseLesson::updateOrCreate(
                ['module_id' => $um1->id, 'title' => 'User Personas, Journey Maps & Information Architecture'],
                [
                    'description' => 'Crafting actionable user personas, mapping empathy journeys, and organizing intuitive site architecture.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $ul1_1->id],
                [
                    'title' => 'User Personas & Journey Mapping in Practice',
                    'video_url' => 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
                    'duration_seconds' => 980,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $ul1_1->id, 'title' => 'User Journey Mapping Worksheet & Template (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 2800000,
                    'sort_order' => 1,
                ]
            );

            $ul1_2 = CourseLesson::updateOrCreate(
                ['module_id' => $um1->id, 'title' => 'Low-Fidelity Wireframing & User Flows in Figma'],
                [
                    'description' => 'Rapid prototyping of structure, grayscale layouts, screen flows, and stakeholder review loops.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $ul1_2->id],
                [
                    'title' => 'Low-Fidelity Wireframing in Figma',
                    'video_url' => 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
                    'duration_seconds' => 1150,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Module 2: Figma Mastery & Auto-Layout
            $um2 = CourseModule::updateOrCreate(
                ['course_id' => $course3->id, 'title' => 'Module 2: Figma Mastery, Auto-Layout & Component Variants'],
                [
                    'description' => 'Master auto-layout 5.0, nested frames, fluid constraints, boolean properties, and variant states.',
                    'sort_order' => 2,
                ]
            );

            $ul2_1 = CourseLesson::updateOrCreate(
                ['module_id' => $um2->id, 'title' => 'Mastering Auto-Layout 5.0, Constraints & Resizing Rules'],
                [
                    'description' => 'Deep dive into hug, fill, fixed sizing, negative spacing, stroke inclusion, and absolute positioning.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $ul2_1->id],
                [
                    'title' => 'Mastering Figma Auto-Layout 5.0',
                    'video_url' => 'https://www.youtube.com/watch?v=NrKX46DzkGQ',
                    'duration_seconds' => 1220,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $ul2_1->id, 'title' => 'Figma Auto-Layout Practice Exercise File (.fig)'],
                [
                    'resource_type' => 'archive',
                    'file_url' => 'https://figma.com',
                    'mime_type' => 'application/octet-stream',
                    'file_size' => 4200000,
                    'sort_order' => 1,
                ]
            );

            $ul2_2 = CourseLesson::updateOrCreate(
                ['module_id' => $um2->id, 'title' => 'Design Tokens, Color Palettes & Accessible Typography Systems'],
                [
                    'description' => 'WCAG contrast compliance, type scale ratios, variable typography, and modular design token structures.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $ul2_2->id],
                [
                    'title' => 'Design Tokens & Accessible Typography',
                    'video_url' => 'https://www.youtube.com/watch?v=7Zhm_K0h3q0',
                    'duration_seconds' => 1340,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            // Module 3: Prototyping & Developer Handoff
            $um3 = CourseModule::updateOrCreate(
                ['course_id' => $course3->id, 'title' => 'Module 3: Interactive Prototyping & Developer Handoff'],
                [
                    'description' => 'High-fidelity animations, interactive component states, Smart Animate, and production design specs.',
                    'sort_order' => 3,
                ]
            );

            $ul3_1 = CourseLesson::updateOrCreate(
                ['module_id' => $um3->id, 'title' => 'Building Clickable Micro-Interactions with Smart Animate'],
                [
                    'description' => 'Crafting micro-interactions, modal overlays, draggable carousels, and realistic mobile navigation.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $ul3_1->id],
                [
                    'title' => 'Smart Animate & Interactive Prototypes',
                    'video_url' => 'https://www.youtube.com/watch?v=480Xg_v1G-E',
                    'duration_seconds' => 1410,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );

            $ul3_2 = CourseLesson::updateOrCreate(
                ['module_id' => $um3->id, 'title' => 'Design System Documentation & Developer Handoff Specs'],
                [
                    'description' => 'Organizing component sheets, documenting token mappings, redlining, and using Dev Mode in Figma.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $ul3_2->id],
                [
                    'title' => 'Developer Handoff & Design System Documentation',
                    'video_url' => 'https://www.youtube.com/watch?v=Y4tP3yv04_4',
                    'duration_seconds' => 1020,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $ul3_2->id, 'title' => 'Design Token Spec Sheet & Documentation (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 1750000,
                    'sort_order' => 1,
                ]
            );

            // Live Class for UI/UX course
            LiveClass::updateOrCreate(
                ['course_id' => $course3->id, 'title' => 'Weekly Live Figma Design Critique & Portfolio Review'],
                [
                    'instructor_id' => $instructor2->id,
                    'lesson_id' => $ul2_1->id,
                    'description' => 'Join instructor Priya Patel for a live review of student Figma portfolios, design critique, and industry guidance.',
                    'meeting_link' => 'https://meet.google.com/xyz-uvwx-rst',
                    'start_time' => Carbon::now()->addDays(5)->setTime(17, 30, 0),
                    'end_time' => Carbon::now()->addDays(5)->setTime(18, 30, 0),
                    'duration_minutes' => 60,
                    'status' => 'scheduled',
                ]
            );
        }

        // -------------------------------------------------------------
        // COURSE 4: Docker, Kubernetes & AWS Cloud DevOps Bootcamp
        // -------------------------------------------------------------
        if ($instructor3) {
            $course4 = Course::updateOrCreate(
                ['slug' => 'docker-kubernetes-aws-devops-bootcamp'],
                [
                    'category_id' => $cloudDevops?->id ?? $webDev->id,
                    'instructor_id' => $instructor3->id,
                    'title' => 'Docker, Kubernetes & AWS Cloud DevOps Bootcamp',
                    'subtitle' => 'Master containerization, Kubernetes cluster orchestration, Helm charts, and continuous automated deployment on AWS.',
                    'description' => "Architect and deploy fault-tolerant, scalable container systems in this comprehensive DevOps engineering bootcamp.\n\nFrom multi-stage Docker builds to production Kubernetes cluster topologies, ingress routing, stateful sets, and automated AWS CI/CD pipelines, this course prepares you for real-world cloud infrastructure engineering.",
                    'curriculum' => [
                        [
                            'title' => 'Container Fundamentals & Docker Deep Dive',
                            'subtitle' => 'Container Architecture, Multi-Stage Dockerfiles, Volume Persistence & Docker Compose',
                        ],
                        [
                            'title' => 'Kubernetes Cluster Architecture & Orchestration',
                            'subtitle' => 'Pods, Deployments, Services, ConfigMaps, Secrets, Ingress Controllers & StatefulSets',
                        ],
                        [
                            'title' => 'AWS Cloud Infrastructure & GitOps CI/CD',
                            'subtitle' => 'Amazon EKS & ECS, GitHub Actions Pipelines, Terraform Infrastructure as Code & Monitoring',
                        ],
                    ],
                    'thumbnail' => 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=60',
                    'price' => 3999.00,
                    'discount_price' => 2499.00,
                    'duration' => '10 Weeks',
                    'type' => 'recorded',
                    'course_includes' => [
                        '10 Weeks of intensive DevOps & Cloud training',
                        'Real-world AWS infrastructure codebases & Terraform scripts',
                        'Production Helm charts & Kubernetes manifest templates',
                        'Direct mentor code reviews & debugging support',
                        'Official Certificate of Completion',
                        'Full lifetime access on mobile & web',
                    ],
                    'is_featured' => false,
                    'status' => 'published',
                ]
            );

            $dm1 = CourseModule::updateOrCreate(
                ['course_id' => $course4->id, 'title' => 'Module 1: Container Fundamentals & Docker Deep Dive'],
                [
                    'description' => 'Container lifecycle, Linux namespaces, cgroups, image layering, and Docker Compose.',
                    'sort_order' => 1,
                ]
            );

            $dl1_1 = CourseLesson::updateOrCreate(
                ['module_id' => $dm1->id, 'title' => 'Docker Architecture, Images, Layer Caching & Dockerfiles'],
                [
                    'description' => 'Understanding how Docker builds images, layer caching, alpine bases, and security hardening.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $dl1_1->id],
                [
                    'title' => 'Docker Architecture & Multi-Stage Builds',
                    'video_url' => 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
                    'duration_seconds' => 1080,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $dl1_1->id, 'title' => 'Docker Commands & Multi-Stage Cheat Sheet (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 1950000,
                    'sort_order' => 1,
                ]
            );

            $dl1_2 = CourseLesson::updateOrCreate(
                ['module_id' => $dm1->id, 'title' => 'Multi-Container Orchestration with Docker Compose'],
                [
                    'description' => 'Networking, volumes, dependency ordering, environment substitution, and health checks.',
                    'sort_order' => 2,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $dl1_2->id],
                [
                    'title' => 'Multi-Container Docker Compose in Practice',
                    'video_url' => 'https://www.youtube.com/watch?v=HG68Ymazo18',
                    'duration_seconds' => 1240,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
        }

        // -------------------------------------------------------------
        // COURSE 5: Cross-Platform Mobile Apps with Flutter & Dart
        // -------------------------------------------------------------
        if ($instructor4) {
            $course5 = Course::updateOrCreate(
                ['slug' => 'cross-platform-mobile-flutter-dart'],
                [
                    'category_id' => $mobileDev?->id ?? $webDev->id,
                    'instructor_id' => $instructor4->id,
                    'title' => 'Cross-Platform Mobile Apps with Flutter & Dart',
                    'subtitle' => 'Build high-performance, beautiful native mobile applications for iOS and Android using Flutter 3 and Riverpod.',
                    'description' => "Master cross-platform mobile development with Flutter and Dart.\n\nFrom responsive UI layouts, animations, and clean architecture state management with Riverpod to REST API integration, SQLite persistence, and native device sensors, build full-fledged mobile apps ready for app store deployment.",
                    'curriculum' => [
                        [
                            'title' => 'Dart 3 Mastery & Flutter Widget Tree',
                            'subtitle' => 'Dart Language Core, Stateless & Stateful Widgets, Responsive Layouts & Custom Painters',
                        ],
                        [
                            'title' => 'State Management with Riverpod 2.0',
                            'subtitle' => 'Providers, StateNotifiers, AsyncValue, Dependency Injection & Clean Domain Architecture',
                        ],
                        [
                            'title' => 'REST APIs, Offline Caching & App Store Launch',
                            'subtitle' => 'Dio HTTP Client, Hive/SQLite Local Storage, Push Notifications & Store Guidelines',
                        ],
                    ],
                    'thumbnail' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
                    'price' => 3499.00,
                    'discount_price' => 2199.00,
                    'duration' => '8 Weeks',
                    'type' => 'live',
                    'course_includes' => [
                        '8 Weeks of hands-on mobile app development',
                        '3 Production-ready iOS & Android capstone apps',
                        'Downloadable UI kits & Flutter starter boilerplate code',
                        'App Store & Play Store publishing review checklist',
                        'Official Certificate of Completion',
                        'Full lifetime access on mobile & web',
                    ],
                    'is_featured' => true,
                    'status' => 'published',
                ]
            );

            $fm1 = CourseModule::updateOrCreate(
                ['course_id' => $course5->id, 'title' => 'Module 1: Dart 3 Mastery & Flutter Widget Architecture'],
                [
                    'description' => 'Dart OOP, null safety, asynchronous streams, and building flexible Flutter widget trees.',
                    'sort_order' => 1,
                ]
            );

            $fl1_1 = CourseLesson::updateOrCreate(
                ['module_id' => $fm1->id, 'title' => 'Dart 3 Syntax, Async Streams & Flutter Widget Tree'],
                [
                    'description' => 'Pattern matching, records, async/await streams, widget lifecycle, and rendering pipelines.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $fl1_1->id],
                [
                    'title' => 'Dart 3 & Flutter Widget Architecture',
                    'video_url' => 'https://www.youtube.com/watch?v=1ukSR1GRtMU',
                    'duration_seconds' => 1120,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $fl1_1->id, 'title' => 'Dart 3 & Flutter Widgets Cheatsheet (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 2100000,
                    'sort_order' => 1,
                ]
            );

            LiveClass::updateOrCreate(
                ['course_id' => $course5->id, 'title' => 'Live Mobile State Management & Riverpod Workshop'],
                [
                    'instructor_id' => $instructor4->id,
                    'lesson_id' => $fl1_1->id,
                    'description' => 'Live code walkthrough of Riverpod 2.0 state architecture with interactive mobile Q&A.',
                    'meeting_link' => 'https://meet.google.com/flt-mob-app',
                    'start_time' => Carbon::now()->addDays(4)->setTime(16, 0, 0),
                    'end_time' => Carbon::now()->addDays(4)->setTime(17, 30, 0),
                    'duration_minutes' => 90,
                    'status' => 'scheduled',
                ]
            );
        }

        // -------------------------------------------------------------
        // COURSE 6: Python & Django REST Framework Bootcamp
        // -------------------------------------------------------------
        if ($instructor5) {
            $course6 = Course::updateOrCreate(
                ['slug' => 'python-django-rest-framework-bootcamp'],
                [
                    'category_id' => $pythonAi?->id ?? $webDev->id,
                    'instructor_id' => $instructor5->id,
                    'title' => 'Python & Django REST Framework Bootcamp',
                    'subtitle' => 'Architect enterprise RESTful APIs, background task queues with Celery, and practical AI integrations with Python 3.12.',
                    'description' => "Comprehensive mastery of modern backend engineering with Python and Django REST Framework.\n\nCovering advanced OOP, query optimization, JWT auth, permissions, background job queues with Celery & Redis, and integrating machine learning API endpoints.",
                    'curriculum' => [
                        [
                            'title' => 'Advanced Python OOP & System Design',
                            'subtitle' => 'Decorators, Generators, Context Managers, Asyncio & Clean Architecture',
                        ],
                        [
                            'title' => 'Django REST Framework (DRF) APIs',
                            'subtitle' => 'Serializers, ViewSets, JWT Authentication, Custom Permissions & Filtering',
                        ],
                        [
                            'title' => 'Celery Background Tasks & Model Serving',
                            'subtitle' => 'Asynchronous Workers, Redis Queues, FastAPI Endpoints & AI Integration',
                        ],
                    ],
                    'thumbnail' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
                    'price' => 2999.00,
                    'discount_price' => 1899.00,
                    'duration' => '6 Weeks',
                    'type' => 'recorded',
                    'course_includes' => [
                        '6 Weeks of structured Python backend training',
                        'Real-world Django REST Framework API codebases',
                        'Celery worker configurations & Docker setups',
                        'Direct mentor code reviews & debugging support',
                        'Official Certificate of Completion',
                        'Full lifetime access on mobile & web',
                    ],
                    'is_featured' => false,
                    'status' => 'published',
                ]
            );

            $pm1 = CourseModule::updateOrCreate(
                ['course_id' => $course6->id, 'title' => 'Module 1: Advanced Python & DRF Architecture'],
                [
                    'description' => 'Modern Python 3.12 syntax, decorators, serializers, and ViewSets.',
                    'sort_order' => 1,
                ]
            );

            $pl1_1 = CourseLesson::updateOrCreate(
                ['module_id' => $pm1->id, 'title' => 'Decorators, Generators, Context Managers & Concurrency'],
                [
                    'description' => 'Master advanced Python patterns for high-throughput enterprise applications.',
                    'sort_order' => 1,
                    'status' => 'published',
                ]
            );
            LessonVideo::updateOrCreate(
                ['lesson_id' => $pl1_1->id],
                [
                    'title' => 'Advanced Python OOP & System Design',
                    'video_url' => 'https://www.youtube.com/watch?v=HGOBQPFzWKo',
                    'duration_seconds' => 1190,
                    'video_provider' => 'youtube',
                    'status' => 'ready',
                ]
            );
            LessonResource::updateOrCreate(
                ['lesson_id' => $pl1_1->id, 'title' => 'Python Backend Architecture Cheatsheet (PDF)'],
                [
                    'resource_type' => 'pdf',
                    'file_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    'mime_type' => 'application/pdf',
                    'file_size' => 1780000,
                    'sort_order' => 1,
                ]
            );
        }

        // -------------------------------------------------------------
        // ENROLLMENTS & PAYMENTS SEEDING (15 Students Distributed)
        // -------------------------------------------------------------
        $allStudents = User::where('role', 'student')->get()->keyBy('email');
        $availableCourses = Course::where('status', 'published')->get()->keyBy('slug');

        $enrollmentMatrix = [
            'rahul@example.com' => ['master-full-stack-laravel-12-inertia-react', 'complete-modern-web-development-zero-to-pro'],
            'aarav.mehta@example.com' => ['master-full-stack-laravel-12-inertia-react', 'cross-platform-mobile-flutter-dart'],
            'sneha.reddy@example.com' => ['master-full-stack-laravel-12-inertia-react', 'python-django-rest-framework-bootcamp'],
            'rohan.joshi@example.com' => ['master-full-stack-laravel-12-inertia-react', 'complete-modern-web-development-zero-to-pro'],
            'kavya.nair@example.com' => ['ui-ux-design-systems-prototyping-figma', 'cross-platform-mobile-flutter-dart'],
            'ishaan.kapoor@example.com' => ['docker-kubernetes-aws-devops-bootcamp', 'cross-platform-mobile-flutter-dart'],
            'pooja.iyer@example.com' => ['master-full-stack-laravel-12-inertia-react', 'docker-kubernetes-aws-devops-bootcamp'],
            'aditya.c@example.com' => ['master-full-stack-laravel-12-inertia-react', 'complete-modern-web-development-zero-to-pro'],
            'rhea.bhatia@example.com' => ['ui-ux-design-systems-prototyping-figma', 'cross-platform-mobile-flutter-dart'],
            'siddharth.m@example.com' => ['master-full-stack-laravel-12-inertia-react', 'python-django-rest-framework-bootcamp'],
            'tanvi.d@example.com' => ['complete-modern-web-development-zero-to-pro', 'ui-ux-design-systems-prototyping-figma'],
            'varun.n@example.com' => ['complete-modern-web-development-zero-to-pro', 'docker-kubernetes-aws-devops-bootcamp'],
            'meera.s@example.com' => ['ui-ux-design-systems-prototyping-figma'],
            'karan.saxena@example.com' => ['master-full-stack-laravel-12-inertia-react', 'python-django-rest-framework-bootcamp'],
            'divya.pillai@example.com' => ['master-full-stack-laravel-12-inertia-react', 'docker-kubernetes-aws-devops-bootcamp'],
        ];

        foreach ($enrollmentMatrix as $email => $courseSlugs) {
            $studentUser = $allStudents->get($email);
            if (! $studentUser) {
                continue;
            }

            foreach ($courseSlugs as $slug) {
                $targetCourse = $availableCourses->get($slug);
                if (! $targetCourse) {
                    continue;
                }

                Enrollment::updateOrCreate(
                    [
                        'user_id' => $studentUser->id,
                        'course_id' => $targetCourse->id,
                    ],
                    [
                        'status' => 'active',
                        'enrolled_at' => Carbon::now()->subDays(rand(2, 20)),
                    ]
                );

                Payment::updateOrCreate(
                    [
                        'user_id' => $studentUser->id,
                        'course_id' => $targetCourse->id,
                    ],
                    [
                        'razorpay_order_id' => 'order_demo_'.substr(md5($studentUser->email.$targetCourse->id), 0, 10),
                        'razorpay_payment_id' => 'pay_demo_'.substr(md5($studentUser->email.$targetCourse->id), 0, 10),
                        'razorpay_signature' => 'sig_demo_'.substr(md5($studentUser->email.$targetCourse->id), 0, 10),
                        'amount' => $targetCourse->discount_price ?? $targetCourse->price,
                        'currency' => 'INR',
                        'status' => 'successful',
                    ]
                );
            }
        }

        // Admin enrollments for direct testing
        if ($admin && isset($course1, $course3)) {
            Enrollment::updateOrCreate(
                [
                    'user_id' => $admin->id,
                    'course_id' => $course1->id,
                ],
                [
                    'status' => 'active',
                    'enrolled_at' => Carbon::now()->subDays(2),
                ]
            );

            Enrollment::updateOrCreate(
                [
                    'user_id' => $admin->id,
                    'course_id' => $course3->id,
                ],
                [
                    'status' => 'active',
                    'enrolled_at' => Carbon::now()->subDays(1),
                ]
            );
        }
    }
}
