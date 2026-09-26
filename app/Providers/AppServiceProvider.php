<?php

namespace App\Providers;

use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if ($this->app->runningInConsole()) {
            $iniDir = realpath(base_path('.config/php'));
            if ($iniDir && is_dir($iniDir)) {
                $currentScanDir = (string) getenv('PHP_INI_SCAN_DIR');
                if (! str_contains($currentScanDir, $iniDir)) {
                    $newScanDir = $currentScanDir ? $currentScanDir.':'.$iniDir : ':'.$iniDir;
                    putenv("PHP_INI_SCAN_DIR={$newScanDir}");
                    $_ENV['PHP_INI_SCAN_DIR'] = $newScanDir;
                    $_SERVER['PHP_INI_SCAN_DIR'] = $newScanDir;
                }
            }

            if (class_exists(ServeCommand::class) && ! in_array('PHP_INI_SCAN_DIR', ServeCommand::$passthroughVariables, true)) {
                ServeCommand::$passthroughVariables[] = 'PHP_INI_SCAN_DIR';
            }
        }
    }
}
