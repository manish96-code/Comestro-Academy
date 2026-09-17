<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseExam;
use App\Models\ExamSubmission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CourseExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $student = User::where('email', 'rahul@example.com')->first();
        $admin = User::where('email', 'manish@gmail.com')->first();

        // -------------------------------------------------------------
        // EXAM 1: Master Full-Stack Laravel 12 & Inertia React
        // -------------------------------------------------------------
        $course1 = Course::where('slug', 'master-full-stack-laravel-12-inertia-react')->first();
        if ($course1) {
            $exam1 = CourseExam::updateOrCreate(
                ['course_id' => $course1->id],
                [
                    'title' => 'Master Certification Exam: Laravel 12 & Inertia React',
                    'description' => 'Comprehensive evaluation testing your knowledge on Eloquent ORM, Inertia v2 deferred props, authentication, and REST API architecture.',
                    'duration_minutes' => 30,
                    'marks_per_question' => 2,
                    'passing_percentage' => 70,
                    'is_published' => true,
                ]
            );

            // Re-seed questions for Exam 1
            $exam1->questions()->delete();

            $q1 = $exam1->questions()->create([
                'question_text' => 'Which Inertia.js v2 feature allows props to be loaded asynchronously without blocking the initial page render?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'Deferred Props in Inertia v2 allow non-critical data to be loaded in the background after the page renders.',
                'sort_order' => 1,
            ]);
            $q1->options()->createMany([
                ['option_text' => 'Deferred Props', 'is_correct' => true, 'sort_order' => 1],
                ['option_text' => 'Partial Reloads only', 'is_correct' => false, 'sort_order' => 2],
                ['option_text' => 'Shared Props', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'Static Page Props', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q2 = $exam1->questions()->create([
                'question_text' => 'In Laravel 12, which Eloquent method should be used to eliminate the N+1 database query problem when fetching relationships?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'The with() method implements Eager Loading which executes relationships in bulk queries.',
                'sort_order' => 2,
            ]);
            $q2->options()->createMany([
                ['option_text' => 'Lazy Loading on every loop iteration', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => 'Eager Loading using with() or load()', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => 'Calling $model->saveQuietly()', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'Disabling database foreign keys', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q3 = $exam1->questions()->create([
                'question_text' => 'What HTTP response status code should be returned when a resource is successfully created via a POST API request?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => '201 Created is the standard HTTP status code indicating successful creation of a new resource.',
                'sort_order' => 3,
            ]);
            $q3->options()->createMany([
                ['option_text' => '200 OK', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => '201 Created', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => '204 No Content', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => '301 Moved Permanently', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q4 = $exam1->questions()->create([
                'question_text' => 'How does Inertia.js coordinate navigation between pages while preserving single-page application feel?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'Inertia intercepts link clicks, makes an XHR/Fetch request with X-Inertia header, and replaces page props in React state without full page reloads.',
                'sort_order' => 4,
            ]);
            $q4->options()->createMany([
                ['option_text' => 'It sends full HTML documents on every navigation', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => 'It intercepts requests via XHR/Fetch and swaps component props dynamically', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => 'It compiles everything into a static website with Webpack only', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'It replaces the browser with a WebSocket listener', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q5 = $exam1->questions()->create([
                'question_text' => 'Which command is recommended to execute Pest tests in a compact, readable output in Laravel?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'php artisan test --compact or vendor/bin/pest executes the test suite concisely.',
                'sort_order' => 5,
            ]);
            $q5->options()->createMany([
                ['option_text' => 'php artisan test --compact', 'is_correct' => true, 'sort_order' => 1],
                ['option_text' => 'php artisan migrate:fresh', 'is_correct' => false, 'sort_order' => 2],
                ['option_text' => 'composer dump-autoload', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'php artisan optimize:clear', 'is_correct' => false, 'sort_order' => 4],
            ]);

            // Scenario A: Rahul has 100% completed Course 1 lectures AND has passed the exam (Status: Passed)
            if ($student) {
                $lessonIds = $course1->lessons()->pluck('course_lessons.id')->toArray();
                if (! empty($lessonIds)) {
                    $student->completedLessons()->syncWithoutDetaching($lessonIds);
                }

                ExamSubmission::updateOrCreate(
                    [
                        'course_exam_id' => $exam1->id,
                        'user_id' => $student->id,
                    ],
                    [
                        'started_at' => Carbon::now()->subDays(1)->subMinutes(25),
                        'submitted_at' => Carbon::now()->subDays(1),
                        'score' => 10,
                        'total_marks' => 10,
                        'percentage' => 100,
                        'is_passed' => true,
                        'answers' => [
                            $q1->id => [$q1->options()->where('is_correct', true)->value('id')],
                            $q2->id => [$q2->options()->where('is_correct', true)->value('id')],
                            $q3->id => [$q3->options()->where('is_correct', true)->value('id')],
                            $q4->id => [$q4->options()->where('is_correct', true)->value('id')],
                            $q5->id => [$q5->options()->where('is_correct', true)->value('id')],
                        ],
                        'status' => 'completed',
                    ]
                );
            }

            // Also complete Course 1 for admin so admin can test directly in student view
            if ($admin) {
                $lessonIds = $course1->lessons()->pluck('course_lessons.id')->toArray();
                if (! empty($lessonIds)) {
                    $admin->completedLessons()->syncWithoutDetaching($lessonIds);
                }
            }
        }

        // -------------------------------------------------------------
        // EXAM 2: Next.js 15 & Full-Stack TypeScript Masterclass
        // -------------------------------------------------------------
        $course2 = Course::where('slug', 'nextjs-15-fullstack-typescript-masterclass')->first();
        if ($course2) {
            $exam2 = CourseExam::updateOrCreate(
                ['course_id' => $course2->id],
                [
                    'title' => 'Final Certification Exam: Next.js 15 & TypeScript',
                    'description' => 'Test your proficiency in Server Components, Server Actions, TypeScript strict types, and App Router caching.',
                    'duration_minutes' => 25,
                    'marks_per_question' => 1,
                    'passing_percentage' => 60,
                    'is_published' => true,
                ]
            );

            $exam2->questions()->delete();

            $q1 = $exam2->questions()->create([
                'question_text' => 'By default in Next.js 15 App Router, what type of components are created inside the app directory?',
                'question_type' => 'single_choice',
                'marks' => 1,
                'explanation' => 'All components in the app directory are React Server Components (RSC) by default unless marked with "use client".',
                'sort_order' => 1,
            ]);
            $q1->options()->createMany([
                ['option_text' => 'React Server Components (RSC)', 'is_correct' => true, 'sort_order' => 1],
                ['option_text' => 'Client Components ("use client")', 'is_correct' => false, 'sort_order' => 2],
                ['option_text' => 'Legacy Pages Components', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'Service Workers', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q2 = $exam2->questions()->create([
                'question_text' => 'Which directive must be added at the very top of a file to declare asynchronous Server Actions in Next.js?',
                'question_type' => 'single_choice',
                'marks' => 1,
                'explanation' => '"use server" marks async functions to execute strictly on the server.',
                'sort_order' => 2,
            ]);
            $q2->options()->createMany([
                ['option_text' => '"use client"', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => '"use server"', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => '"use api"', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => '"use backend"', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q3 = $exam2->questions()->create([
                'question_text' => 'Which TypeScript utility type constructs a type with all properties of T set to optional?',
                'question_type' => 'single_choice',
                'marks' => 1,
                'explanation' => 'Partial<T> makes all properties optional.',
                'sort_order' => 3,
            ]);
            $q3->options()->createMany([
                ['option_text' => 'Required<T>', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => 'Partial<T>', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => 'Readonly<T>', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'Pick<T, K>', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q4 = $exam2->questions()->create([
                'question_text' => 'What is the primary benefit of React Server Components (RSC) over client-side rendering?',
                'question_type' => 'single_choice',
                'marks' => 1,
                'explanation' => 'RSC executes on the server, resulting in zero client JavaScript bundle size for those components.',
                'sort_order' => 4,
            ]);
            $q4->options()->createMany([
                ['option_text' => 'Zero client-side JavaScript bundle overhead for server components', 'is_correct' => true, 'sort_order' => 1],
                ['option_text' => 'Allows using useState inside server components directly', 'is_correct' => false, 'sort_order' => 2],
                ['option_text' => 'Replaces CSS with binary styling', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'Removes the need for HTML entirely', 'is_correct' => false, 'sort_order' => 4],
            ]);

            // Scenario B: Rahul has 100% completed Course 2 lectures and is READY to attempt (Status: Ready to Attempt)
            if ($student) {
                $lessonIds = $course2->lessons()->pluck('course_lessons.id')->toArray();
                if (! empty($lessonIds)) {
                    $student->completedLessons()->syncWithoutDetaching($lessonIds);
                }
                // Ensure no submission exists yet so it is unlocked and ready to attempt!
                ExamSubmission::where('course_exam_id', $exam2->id)
                    ->where('user_id', $student->id)
                    ->delete();
            }
        }

        // -------------------------------------------------------------
        // EXAM 3: Complete Modern Web Development (Zero to Pro)
        // -------------------------------------------------------------
        $course3 = Course::where('slug', 'complete-modern-web-development-zero-to-pro')->first();
        if ($course3) {
            $exam3 = CourseExam::updateOrCreate(
                ['course_id' => $course3->id],
                [
                    'title' => 'Web Development Fundamentals Certification Exam',
                    'description' => 'Test your core understanding of semantic HTML5, modern flexbox & grid CSS layout systems, and modern ES6+ JavaScript.',
                    'duration_minutes' => 20,
                    'marks_per_question' => 2,
                    'passing_percentage' => 70,
                    'is_published' => true,
                ]
            );

            $exam3->questions()->delete();

            $q1 = $exam3->questions()->create([
                'question_text' => 'Which CSS Flexbox property determines the alignment of flex items along the cross axis?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'align-items aligns items along the cross axis, while justify-content aligns along the main axis.',
                'sort_order' => 1,
            ]);
            $q1->options()->createMany([
                ['option_text' => 'justify-content', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => 'align-items', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => 'flex-direction', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'flex-wrap', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q2 = $exam3->questions()->create([
                'question_text' => 'Which array method in JavaScript returns a new array with all elements that pass the provided callback condition?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'filter() creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test.',
                'sort_order' => 2,
            ]);
            $q2->options()->createMany([
                ['option_text' => 'map()', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => 'filter()', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => 'forEach()', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'reduce()', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q3 = $exam3->questions()->create([
                'question_text' => 'What is the difference between "==" and "===" operators in JavaScript?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => '=== performs strict equality without type coercion, whereas == converts operands to the same type before comparison.',
                'sort_order' => 3,
            ]);
            $q3->options()->createMany([
                ['option_text' => '== checks type and value; === only checks value', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => '=== checks both type and value without type coercion', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => 'There is no difference in modern ES6 JavaScript', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => '=== is deprecated in strict mode', 'is_correct' => false, 'sort_order' => 4],
            ]);

            // Scenario C: Rahul has only completed ~35% of lectures for Course 3 (Status: Locked)
            if ($student) {
                $allLessons = $course3->lessons()->pluck('course_lessons.id')->toArray();
                $partialCount = max(1, (int) round(count($allLessons) * 0.35));
                $partialLessonIds = array_slice($allLessons, 0, $partialCount);

                // Detach all first, then attach only partial
                $student->completedLessons()->detach($allLessons);
                $student->completedLessons()->attach($partialLessonIds, ['completed_at' => now()]);

                ExamSubmission::where('course_exam_id', $exam3->id)
                    ->where('user_id', $student->id)
                    ->delete();
            }
        }

        // -------------------------------------------------------------
        // EXAM 4: Docker, Kubernetes & AWS DevOps Bootcamp
        // -------------------------------------------------------------
        $course4 = Course::where('slug', 'docker-kubernetes-aws-devops-bootcamp')->first();
        if ($course4) {
            $exam4 = CourseExam::updateOrCreate(
                ['course_id' => $course4->id],
                [
                    'title' => 'DevOps & Cloud Engineering Certification Assessment',
                    'description' => 'Verify your command over Docker multi-stage builds, Kubernetes Pod deployments, and CI/CD pipelines.',
                    'duration_minutes' => 30,
                    'marks_per_question' => 2,
                    'passing_percentage' => 70,
                    'is_published' => true,
                ]
            );

            $exam4->questions()->delete();

            $q1 = $exam4->questions()->create([
                'question_text' => 'What is the primary benefit of using multi-stage Docker builds?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'Multi-stage builds allow compiling in an intermediate container and copying only compiled artifacts to the final lightweight image.',
                'sort_order' => 1,
            ]);
            $q1->options()->createMany([
                ['option_text' => 'Dramatically reduces the final production image size by stripping build dependencies', 'is_correct' => true, 'sort_order' => 1],
                ['option_text' => 'Allows running multiple operating systems simultaneously in one container', 'is_correct' => false, 'sort_order' => 2],
                ['option_text' => 'Disables container networking for enhanced security', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'Eliminates the requirement for Docker daemon', 'is_correct' => false, 'sort_order' => 4],
            ]);

            $q2 = $exam4->questions()->create([
                'question_text' => 'Which Kubernetes object is responsible for ensuring a specified number of pod replicas are running at any given time?',
                'question_type' => 'single_choice',
                'marks' => 2,
                'explanation' => 'ReplicaSet (and Deployments managing them) maintain the desired count of Pod replicas.',
                'sort_order' => 2,
            ]);
            $q2->options()->createMany([
                ['option_text' => 'ConfigMap', 'is_correct' => false, 'sort_order' => 1],
                ['option_text' => 'ReplicaSet / Deployment', 'is_correct' => true, 'sort_order' => 2],
                ['option_text' => 'Ingress Controller', 'is_correct' => false, 'sort_order' => 3],
                ['option_text' => 'PersistentVolumeClaim', 'is_correct' => false, 'sort_order' => 4],
            ]);
        }
    }
}
