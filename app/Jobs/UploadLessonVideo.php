<?php

namespace App\Jobs;

use App\Models\LessonVideo;
use App\Services\ImageKitService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UploadLessonVideo implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $timeout = 600;

    public function __construct(
        public LessonVideo $lessonVideo,
        public string $tempDiskPath,
        public ?string $oldStorageKey = null,
        public ?string $oldProvider = null,
    ) {}

    public function handle(ImageKitService $imageKit): void
    {
        if (! Storage::disk('local')->exists($this->tempDiskPath)) {
            Log::warning("UploadLessonVideo: temp video file not found at {$this->tempDiskPath}");
            $this->lessonVideo->update(['status' => 'failed']);

            return;
        }

        $fullPath = Storage::disk('local')->path($this->tempDiskPath);

        try {
            if (config('services.imagekit.private_key')) {
                // Delete old video from ImageKit or local if replacing
                if ($this->oldStorageKey) {
                    if ($this->oldProvider === 'imagekit') {
                        $imageKit->deleteFile($this->oldStorageKey);
                    } elseif ($this->oldProvider === 'local') {
                        Storage::disk('public')->delete($this->oldStorageKey);
                    }
                }

                $upload = $imageKit->upload($fullPath, '/courses/videos');

                $videoUrl = $upload['url'];
                if (str_contains($videoUrl, 'ik.imagekit.io') && ! str_contains($videoUrl, 'tr=')) {
                    $videoUrl = str_contains($videoUrl, '?') ? "{$videoUrl}&tr=orig" : "{$videoUrl}?tr=orig";
                }

                $this->lessonVideo->update([
                    'video_url' => $videoUrl,
                    'storage_key' => $upload['fileId'] ?? null,
                    'video_provider' => 'imagekit',
                    'status' => 'ready',
                ]);
            } else {
                $targetPath = 'courses/videos/'.basename($this->tempDiskPath);
                Storage::disk('public')->put($targetPath, Storage::disk('local')->get($this->tempDiskPath));

                $this->lessonVideo->update([
                    'video_url' => Storage::url($targetPath),
                    'storage_key' => $targetPath,
                    'video_provider' => 'local',
                    'status' => 'ready',
                ]);
            }
        } catch (Throwable $e) {
            Log::error('UploadLessonVideo failed: '.$e->getMessage(), ['exception' => $e]);
            $this->lessonVideo->update(['status' => 'failed']);
            throw $e;
        } finally {
            Storage::disk('local')->delete($this->tempDiskPath);
        }
    }
}
