<?php

namespace App\Mail;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CourseEnrollmentMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public string $studentName;

    /**
     * Create a new message instance.
     */
    public function __construct(public Enrollment $enrollment)
    {
        $this->enrollment->loadMissing([
            'user',
            'course.instructor.user',
            'course.category',
        ]);

        $rawName = $this->enrollment->user?->name ?? 'Student';
        $this->studentName = ucwords(strtolower(trim($rawName)));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $courseTitle = $this->enrollment->course?->title ?? 'Your Course';

        return new Envelope(
            subject: "🎉 Enrollment Confirmed: {$courseTitle} | Comestro Academy",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.course_enrolled',
            with: [
                'enrollment' => $this->enrollment,
                'course' => $this->enrollment->course,
                'user' => $this->enrollment->user,
                'studentName' => $this->studentName,
                'classroomUrl' => url('/student/courses/'.$this->enrollment->course?->slug.'/learn'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
