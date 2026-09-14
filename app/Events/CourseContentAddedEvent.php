<?php

namespace App\Events;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\CourseModule;
use App\Models\User;
use App\Notifications\CourseContentAddedNotification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Notification;

class CourseContentAddedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The notification payload to broadcast.
     *
     * @var array<string, mixed>
     */
    public array $notification;

    /**
     * Create a new event instance.
     *
     * @param  array<int, int>  $studentIds
     */
    public function __construct(
        public Course $course,
        public CourseModule $module,
        public CourseLesson $lesson,
        public bool $isNewModule = false,
        public array $studentIds = []
    ) {
        $message = $this->isNewModule
            ? "New module added: \"{$this->module->title}\" with lecture \"{$this->lesson->title}\" in {$this->course->title}"
            : "New lecture added: \"{$this->lesson->title}\" in {$this->course->title}";

        $this->notification = [
            'id' => (string) str()->uuid(),
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

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return array_map(
            fn ($id) => new PrivateChannel('student-notifications.'.$id),
            $this->studentIds
        );
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'content.added';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return $this->notification;
    }

    /**
     * Safely dispatch DB notifications and broadcast event to enrolled students.
     *
     * @param  Collection<int, User>|array<int, User>  $students
     */
    public static function dispatchSafely(
        Course $course,
        CourseModule $module,
        CourseLesson $lesson,
        bool $isNewModule,
        iterable $students
    ): void {
        $studentCollection = collect($students);
        if ($studentCollection->isEmpty()) {
            return;
        }

        // 1. Dispatch persistent database notification to all enrolled students
        rescue(function () use ($course, $module, $lesson, $isNewModule, $studentCollection) {
            Notification::send($studentCollection, new CourseContentAddedNotification($course, $module, $lesson, $isNewModule));
        });

        // 2. Broadcast via WebSocket to all enrolled students
        $studentIds = $studentCollection->pluck('id')->filter()->all();
        if (! empty($studentIds)) {
            rescue(fn () => static::dispatch($course, $module, $lesson, $isNewModule, $studentIds));
        }
    }
}
