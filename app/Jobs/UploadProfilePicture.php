<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\ImageKitService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class UploadProfilePicture implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public string $base64Data,
        public string $originalName,
    ) {}

    // Process upload to ImageKit and update student avatar
    public function handle(ImageKitService $imageKit): void
    {
        $upload = $imageKit->uploadBase64($this->base64Data, $this->originalName, '/profiles');

        $this->user->update([
            'profile_pic' => $upload['url'],
        ]);
    }
}
