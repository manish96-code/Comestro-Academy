<?php

namespace App\Services;

use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class ImageKitService
{
    /**
     * Upload an image or video to ImageKit.
     *
     * @return array{url: string, fileId: string, name: string}
     */
    public function upload(UploadedFile|File|string $file, string $folder = '/courses'): array
    {
        $privateKey = config('services.imagekit.private_key');

        if (! $privateKey) {
            throw new RuntimeException('ImageKit private key is not configured in .env.');
        }

        if (is_string($file)) {
            $realPath = $file;
            $originalName = basename($file);
            $extension = pathinfo($file, PATHINFO_EXTENSION);
        } elseif ($file instanceof UploadedFile) {
            $realPath = $file->getRealPath();
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
        } else {
            $realPath = $file->getRealPath();
            $originalName = $file->getFilename();
            $extension = $file->getExtension();
        }

        $filename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME))
            .'_'.time().'.'
            .($extension ?: 'mp4');

        $fileHandle = fopen($realPath, 'r');

        try {
            $response = Http::withBasicAuth($privateKey, '')
                ->timeout(600)
                ->connectTimeout(30)
                ->withOptions([
                    'force_ip_resolve' => 'v4',
                ])
                ->attach(
                    'file',
                    $fileHandle,
                    $filename
                )
                ->post('https://upload.imagekit.io/api/v1/files/upload', [
                    'fileName' => $filename,
                    'folder' => $folder,
                    'useUniqueFileName' => 'true',
                ]);
        } finally {
            if (is_resource($fileHandle)) {
                fclose($fileHandle);
            }
        }

        if ($response->failed()) {
            $errorMsg = $response->json('message') ?? $response->body();
            throw new RuntimeException("ImageKit upload failed: {$errorMsg}");
        }

        return $response->json();
    }

    /**
     * Upload a base64 encoded image to ImageKit.
     *
     * @return array{url: string, fileId: string, name: string}
     */
    public function uploadBase64(string $base64Data, string $originalName, string $folder = '/courses'): array
    {
        $privateKey = config('services.imagekit.private_key');

        if (! $privateKey) {
            throw new RuntimeException('ImageKit private key is not configured in .env.');
        }

        $filename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME))
            .'_'.time().'.'
            .pathinfo($originalName, PATHINFO_EXTENSION);

        $response = Http::withBasicAuth($privateKey, '')
            ->timeout(600)
            ->connectTimeout(30)
            ->withOptions([
                'force_ip_resolve' => 'v4',
            ])
            ->asMultipart()
            ->post('https://upload.imagekit.io/api/v1/files/upload', [
                'file' => $base64Data,
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

    /**
     * Delete a file from ImageKit by fileId.
     */
    public function deleteFile(?string $fileId): bool
    {
        if (! $fileId) {
            return false;
        }

        $privateKey = config('services.imagekit.private_key');

        if (! $privateKey) {
            return false;
        }

        try {
            $response = Http::withBasicAuth($privateKey, '')
                ->timeout(30)
                ->withOptions([
                    'force_ip_resolve' => 'v4',
                ])
                ->delete("https://api.imagekit.io/v1/files/{$fileId}");

            return $response->successful();
        } catch (\Throwable) {
            return false;
        }
    }
}
