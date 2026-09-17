<?php

namespace Database\Seeders;

use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminOrInstructor = User::where('role', 'admin')->orWhere('role', 'instructor')->first()
            ?? User::first();

        $studentRahul = User::where('email', 'student@example.com')->first();
        if (! $studentRahul) {
            $studentRahul = User::where('role', 'student')->first();
        }

        $courses = Course::take(3)->get();
        if ($courses->isEmpty()) {
            return;
        }

        // Course 1
        $course1 = $courses[0];
        $asgn1 = CourseAssignment::updateOrCreate(
            [
                'course_id' => $course1->id,
                'title' => 'Milestone 1: Responsive Portfolio & Blog Architecture',
            ],
            [
                'created_by' => $adminOrInstructor?->id,
                'description' => "Design and build a responsive personal portfolio and blog architecture using semantic HTML, modern Tailwind CSS, and clean component structure.\n\nDeliverables:\n1. A comprehensive PDF report explaining your component architecture, color palette, and layout decisions.\n2. Link to your public GitHub repository containing the complete source code and README instructions.",
                'total_marks' => 100,
                'passing_marks' => 40,
                'due_date' => now()->addDays(7),
                'is_published' => true,
                'sort_order' => 1,
            ]
        );

        $asgn2 = CourseAssignment::updateOrCreate(
            [
                'course_id' => $course1->id,
                'title' => 'Milestone 2: RESTful API Authentication & Role Control',
            ],
            [
                'created_by' => $adminOrInstructor?->id,
                'description' => "Implement a secure RESTful API backend featuring JWT/Sanctum authentication, password hashing, user registration, role-based authorization gates, and request validation.\n\nDeliverables:\n1. Postman/Insomnia API collection export or PDF documentation of all tested endpoints.\n2. GitHub repository link with migrations, seeders, and feature test suite.",
                'total_marks' => 100,
                'passing_marks' => 40,
                'due_date' => now()->addDays(14),
                'is_published' => true,
                'sort_order' => 2,
            ]
        );

        // Seed Rahul's graded submission for Assignment 1
        if ($studentRahul) {
            AssignmentSubmission::updateOrCreate(
                [
                    'course_assignment_id' => $asgn1->id,
                    'user_id' => $studentRahul->id,
                ],
                [
                    'submission_text' => 'Completed all responsive layouts across mobile, tablet, and desktop breakpoints. Configured dark mode toggle and verified cross-browser compatibility.',
                    'github_url' => 'https://github.com/rahul-student/comestro-portfolio-project',
                    'file_name' => 'Portfolio_Architecture_Documentation.pdf',
                    'submitted_at' => now()->subDays(2),
                    'is_late' => false,
                    'status' => 'reviewed',
                    'marks_obtained' => 92,
                    'feedback' => 'Outstanding work on the component hierarchy and Tailwind token consistency. Clean responsive typography and well-documented git commits.',
                    'reviewed_by' => $adminOrInstructor?->id,
                    'reviewed_at' => now()->subDay(),
                ]
            );
        }

        // Course 2 (has an overdue assignment to test late submission)
        if (isset($courses[1])) {
            $course2 = $courses[1];
            CourseAssignment::updateOrCreate(
                [
                    'course_id' => $course2->id,
                    'title' => 'Practical Exercise: Data Cleaning & Exploratory Analysis',
                ],
                [
                    'created_by' => $adminOrInstructor?->id,
                    'description' => "Perform exploratory data analysis on the provided customer demographic dataset. Handle missing values, outliers, feature scaling, and generate visualization plots.\n\nDeliverables:\n1. PDF summary of key statistical insights, correlation matrix, and executive findings.\n2. GitHub repository with the Jupyter notebook or Python scripts.",
                    'total_marks' => 50,
                    'passing_marks' => 25,
                    'due_date' => now()->subDays(2), // Overdue!
                    'is_published' => true,
                    'sort_order' => 1,
                ]
            );
        }

        // Course 3
        if (isset($courses[2])) {
            $course3 = $courses[2];
            CourseAssignment::updateOrCreate(
                [
                    'course_id' => $course3->id,
                    'title' => 'Capstone Task: Mobile Navigation & Offline Sync Prototype',
                ],
                [
                    'created_by' => $adminOrInstructor?->id,
                    'description' => "Develop a cross-platform mobile app navigation flow with bottom tabs, nested stacks, and local SQLite/AsyncStorage persistence.\n\nDeliverables:\n1. Technical documentation PDF detailing state management flow.\n2. GitHub repository link.",
                    'total_marks' => 100,
                    'passing_marks' => 50,
                    'due_date' => now()->addDays(10),
                    'is_published' => true,
                    'sort_order' => 1,
                ]
            );
        }
    }
}
