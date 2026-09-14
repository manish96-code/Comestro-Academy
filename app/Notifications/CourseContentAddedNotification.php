<?php

namespace App\Notifications;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CourseContentAddedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Course $course,
        public CourseModule $module,
        public CourseLesson $lesson,
        public bool $isNewModule = false
    ) {}

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
        $message = $this->isNewModule
            ? "New module added: \"{$this->module->title}\" with lecture \"{$this->lesson->title}\" in {$this->course->title}"
            : "New lecture added: \"{$this->lesson->title}\" in {$this->course->title}";

        return [
            'course_id' => $this->course->id,
            'course_title' => $this->course->title,
            'course_slug' => $this->course->slug,
            'module_id' => $this->module->id,
            'module_name' => $this->module->title,
            'lesson_id' => $this->lesson->id,
            'lesson_title' => $this->lesson->title,
            'is_new_module' => $this->isNewModule,
            'type' => $this->isNewModule ? 'module_added' : 'lesson_added',
            'message' => $message,
            'added_at' => now()->toIso8601String(),
        ];
    }
}
