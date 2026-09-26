<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;

if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL'])) {
    foreach (['/tmp/views', '/tmp/cache', '/tmp/sessions'] as $dir) {
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (PostTooLargeException $e, Request $request) {
            $maxUpload = ini_get('upload_max_filesize') ?: '100M';
            $message = "The uploaded video is too large for the server. Maximum allowed upload size is {$maxUpload}.";

            if ($request->header('X-Inertia')) {
                $referer = $request->headers->get('referer') ?: '/';
                $separator = str_contains($referer, '?') ? '&' : '?';
                $redirectUrl = $referer.$separator.'upload_error='.urlencode($message);

                return Inertia::location($redirectUrl);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => $message,
                    'errors' => [
                        'video_file' => [$message],
                    ],
                ], 422);
            }

            return response($message, 413);
        });
    })->create();
