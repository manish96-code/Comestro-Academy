<?php

namespace App\Events;

use App\Models\Enrollment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StudentEnrolledEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The notification payload to broadcast.
     *
     * @var array<string, mixed>
     */
    public array $notification;

    public function __construct(public Enrollment $enrollment)
    {
        $this->enrollment->loadMissing(['user', 'course']);

        $user = $this->enrollment->user;
        $course = $this->enrollment->course;

        $this->notification = [
            'id' => (string) str()->uuid(),
            'student_name' => $user?->name ?? 'Student',
            'profile_pic' => $user?->profile_pic,
            'course_id' => $course?->id,
            'course_title' => $course?->title ?? 'Course',
            'enrolled_at' => $this->enrollment->enrolled_at?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin-notifications'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'student.enrolled';
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
     * Safely dispatch the event without breaking the HTTP request if broadcasting fails (e.g. Reverb offline).
     */
    public static function dispatchSafely(Enrollment $enrollment): void
    {
        rescue(fn () => static::dispatch($enrollment));
    }
}
