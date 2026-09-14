<?php

namespace App\Jobs;

use App\Models\CourseLesson;
use App\Services\ImageKitService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class UploadLessonNotes implements ShouldQueue
{
    use Queueable;

    /**
     * @param  array{resource_type: string, mime_type: string, file_size: int, sort_order: int}  $metadata
     */
    public function __construct(
        public CourseLesson $lesson,
        public string $base64Data,
        public string $originalName,
        public string $title,
        public array $metadata,
    ) {}

    // Upload notes file to ImageKit and attach as a lesson resource.
    public function handle(ImageKitService $imageKit): void
    {
        $upload = $imageKit->uploadBase64($this->base64Data, $this->originalName, '/courses/notes');

        $this->lesson->resources()->create([
            'title' => $this->title,
            'file_url' => $upload['url'],
            'storage_key' => $upload['fileId'] ?? null,
            'resource_type' => $this->metadata['resource_type'],
            'mime_type' => $this->metadata['mime_type'],
            'file_size' => $this->metadata['file_size'],
            'sort_order' => $this->metadata['sort_order'],
        ]);
    }
}
