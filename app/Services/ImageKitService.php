<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class ImageKitService
{
    /**
     * Upload an image to ImageKit.
     *
     * @return array{url: string, fileId: string, name: string}
     */
    public function upload(UploadedFile $file, string $folder = '/courses'): array
    {
        $privateKey = config('services.imagekit.private_key');

        if (! $privateKey) {
            throw new RuntimeException('ImageKit private key is not configured in .env.');
        }

        $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME))
            .'_'.time().'.'
            .$file->getClientOriginalExtension();

        $response = Http::withBasicAuth($privateKey, '')
            ->attach(
                'file',
                file_get_contents($file->getRealPath()),
                $filename
            )
            ->post('https://upload.imagekit.io/api/v1/files/upload', [
                'fileName' => $filename,
                'folder' => $folder,
                'useUniqueFileName' => 'true',
            ]);

        if ($response->failed()) {
            $errorMsg = $response->json('message') ?? $response->body();
            throw new RuntimeException("ImageKit upload failed: {$errorMsg}");
        }

        return $response->json();
    }
}
