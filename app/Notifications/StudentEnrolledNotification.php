<?php

namespace App\Notifications;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StudentEnrolledNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Enrollment $enrollment)
    {
        $this->enrollment->loadMissing(['user', 'course']);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $user = $this->enrollment->user;
        $course = $this->enrollment->course;
        $rawName = $user?->name ?? 'Student';

        return [
            'enrollment_id' => $this->enrollment->id,
            'student_name' => ucwords(strtolower(trim($rawName))),
            'profile_pic' => $user?->profile_pic,
            'course_id' => $course?->id,
            'course_title' => $course?->title ?? 'Course',
            'enrolled_at' => $this->enrollment->enrolled_at?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }
}
