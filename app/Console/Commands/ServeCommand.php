<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand as BaseServeCommand;
use Symfony\Component\Console\Attribute\AsCommand;

use function Illuminate\Support\php_binary;

#[AsCommand(name: 'serve')]
class ServeCommand extends BaseServeCommand
{
    /**
     * Get the full server command with custom upload limits.
     *
     * @return array
     */
    protected function serverCommand()
    {
        $server = file_exists(base_path('server.php'))
            ? base_path('server.php')
            : base_path('vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php');

        return [
            php_binary(),
            '-d',
            'upload_max_filesize=150M',
            '-d',
            'post_max_size=150M',
            '-d',
            'memory_limit=512M',
            '-S',
            $this->host().':'.$this->port(),
            $server,
        ];
    }
}
