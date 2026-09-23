<?php

namespace App\Services;

use App\Models\AssignmentSubmission;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\ExamSubmission;
use App\Models\User;
use DomainException;
use Illuminate\Support\Str;

class CertificateService
{
    /**
     * Check whether a user meets all requirements to receive a course certificate.
     *
     * Criteria:
     * 1. Actively enrolled in the course.
     * 2. 100% course lessons completed (total_lessons > 0 && completed == total).
     * 3. All published exams passed.
     * 4. All published assignments submitted, reviewed, and passed.
     *
     * @return array{
     *     eligible: bool,
     *     enrollment: ?Enrollment,
     *     lessons: array{completed: int, total: int, percentage: int, satisfied: bool},
     *     exams: array{passed: int, total: int, satisfied: bool, pending: array<int, array{id: int, title: string, passing_percentage: int}>},
     *     assignments: array{passed: int, total: int, satisfied: bool, pending: array<int, array{id: int, title: string, reason: string}>},
     *     message: string
     * }
     */
    public function checkEligibility(User $user, Course $course): array
    {
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->first();

        // 1. Lessons progress
        $progress = $course->getProgressFor($user);
        $totalLessons = (int) $progress['total_lessons'];
        $completedLessons = (int) $progress['completed_lessons'];
        $percentage = (int) $progress['progress_percentage'];
        $lessonsSatisfied = ($totalLessons > 0 && $completedLessons >= $totalLessons);

        // 2. Published Exams
        $publishedExams = $course->publishedExams()->get();
        $totalExams = $publishedExams->count();
        $passedExamsCount = 0;
        $pendingExams = [];

        foreach ($publishedExams as $exam) {
            $hasPassed = ExamSubmission::where('course_exam_id', $exam->id)
                ->where('user_id', $user->id)
                ->where('is_passed', true)
                ->exists();

            if ($hasPassed) {
                $passedExamsCount++;
            } else {
                $pendingExams[] = [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'passing_percentage' => (int) $exam->passing_percentage,
                ];
            }
        }
        $examsSatisfied = ($totalExams === 0 || $passedExamsCount === $totalExams);

        // 3. Published Assignments
        $publishedAssignments = $course->assignments()->where('is_published', true)->get();
        $totalAssignments = $publishedAssignments->count();
        $passedAssignmentsCount = 0;
        $pendingAssignments = [];

        foreach ($publishedAssignments as $assignment) {
            $submission = AssignmentSubmission::where('course_assignment_id', $assignment->id)
                ->where('user_id', $user->id)
                ->latest()
                ->first();

            $isPassed = false;
            $reason = 'Not submitted';

            if ($submission) {
                if ($submission->status === 'reviewed') {
                    $passingMarks = $assignment->passing_marks ?? 40;
                    if ($submission->marks_obtained !== null && $submission->marks_obtained >= $passingMarks) {
                        $isPassed = true;
                    } else {
                        $reason = "Scored {$submission->marks_obtained}/{$assignment->total_marks} (Passing: {$passingMarks})";
                    }
                } else {
                    $reason = 'Submission pending instructor review';
                }
            }

            if ($isPassed) {
                $passedAssignmentsCount++;
            } else {
                $pendingAssignments[] = [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'reason' => $reason,
                ];
            }
        }
        $assignmentsSatisfied = ($totalAssignments === 0 || $passedAssignmentsCount === $totalAssignments);

        $eligible = ($enrollment !== null && $lessonsSatisfied && $examsSatisfied && $assignmentsSatisfied);

        $message = 'All certificate requirements met.';
        if (! $enrollment) {
            $message = 'You must be actively enrolled in this course to earn a certificate.';
        } elseif (! $lessonsSatisfied) {
            $message = "Please complete all lessons ({$completedLessons}/{$totalLessons} completed).";
        } elseif (! $examsSatisfied) {
            $message = "You must pass all required exams ({$passedExamsCount}/{$totalExams} passed).";
        } elseif (! $assignmentsSatisfied) {
            $message = "You must submit and pass all course assignments ({$passedAssignmentsCount}/{$totalAssignments} passed).";
        }

        return [
            'eligible' => $eligible,
            'enrollment' => $enrollment,
            'lessons' => [
                'completed' => $completedLessons,
                'total' => $totalLessons,
                'percentage' => $percentage,
                'satisfied' => $lessonsSatisfied,
            ],
            'exams' => [
                'passed' => $passedExamsCount,
                'total' => $totalExams,
                'satisfied' => $examsSatisfied,
                'pending' => $pendingExams,
            ],
            'assignments' => [
                'passed' => $passedAssignmentsCount,
                'total' => $totalAssignments,
                'satisfied' => $assignmentsSatisfied,
                'pending' => $pendingAssignments,
            ],
            'message' => $message,
        ];
    }

    /**
     * Issue or retrieve certificate for a user and course.
     *
     * @throws DomainException if user does not satisfy certificate requirements.
     */
    public function issueCertificate(User $user, Course $course): Certificate
    {
        $existing = Certificate::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return $existing;
        }

        $eligibility = $this->checkEligibility($user, $course);
        if (! $eligibility['eligible']) {
            throw new DomainException($eligibility['message']);
        }

        // Calculate cumulative score percentage
        $scores = [];
        $publishedExams = $course->publishedExams()->get();
        foreach ($publishedExams as $exam) {
            $bestScore = ExamSubmission::where('course_exam_id', $exam->id)
                ->where('user_id', $user->id)
                ->where('is_passed', true)
                ->max('percentage');
            if ($bestScore !== null) {
                $scores[] = (float) $bestScore;
            }
        }

        $publishedAssignments = $course->assignments()->where('is_published', true)->get();
        foreach ($publishedAssignments as $assignment) {
            $submission = AssignmentSubmission::where('course_assignment_id', $assignment->id)
                ->where('user_id', $user->id)
                ->where('status', 'reviewed')
                ->latest()
                ->first();
            if ($submission && $assignment->total_marks > 0 && $submission->marks_obtained !== null) {
                $scores[] = round(($submission->marks_obtained / $assignment->total_marks) * 100, 2);
            }
        }

        $finalScore = ! empty($scores) ? round(array_sum($scores) / count($scores), 2) : 100.00;

        $year = date('Y');
        $random = strtoupper(Str::random(6));
        $certNumber = "CA-{$year}-{$random}";

        return Certificate::create([
            'certificate_number' => $certNumber,
            'uuid' => (string) Str::uuid(),
            'user_id' => $user->id,
            'course_id' => $course->id,
            'enrollment_id' => $eligibility['enrollment']?->id,
            'issued_at' => now(),
            'final_score' => $finalScore,
            'metadata' => [
                'student_name' => $user->name,
                'student_email' => $user->email,
                'course_title' => $course->title,
                'course_slug' => $course->slug,
                'course_duration' => $course->duration ?? 'Self-paced',
                'course_category' => $course->category?->name ?? 'Software Engineering',
                'instructor_name' => $course->instructor?->user?->name ?? 'Comestro Faculty Team',
                'total_lessons' => $eligibility['lessons']['total'],
                'exams_count' => $eligibility['exams']['total'],
                'assignments_count' => $eligibility['assignments']['total'],
                'final_score' => $finalScore,
            ],
            'status' => 'active',
        ]);
    }

    /**
     * Get data payload for the student certificates dashboard.
     *
     * @return array{
     *     earned: array<int, mixed>
     * }
     */
    public function getStudentCertificatesData(User $user): array
    {
        $earnedCertificates = Certificate::with(['course:id,title,slug,thumbnail,duration'])
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest('issued_at')
            ->get()
            ->map(function (Certificate $cert) {
                return [
                    'id' => $cert->id,
                    'certificate_number' => $cert->certificate_number,
                    'uuid' => $cert->uuid,
                    'course_id' => $cert->course_id,
                    'course_title' => $cert->metadata['course_title'] ?? $cert->course?->title,
                    'course_slug' => $cert->metadata['course_slug'] ?? $cert->course?->slug,
                    'course_duration' => $cert->metadata['course_duration'] ?? $cert->course?->duration,
                    'course_thumbnail' => $cert->course?->thumbnail,
                    'student_name' => $cert->metadata['student_name'] ?? $cert->user?->name,
                    'instructor_name' => $cert->metadata['instructor_name'] ?? 'Comestro Faculty Team',
                    'issued_at' => $cert->issued_at->format('M d, Y'),
                    'final_score' => $cert->final_score,
                    'verification_url' => route('certificates.verify', $cert->certificate_number),
                ];
            });

        return [
            'earned' => $earnedCertificates,
        ];
    }
}
