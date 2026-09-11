<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lesson_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('course_lessons')->cascadeOnDelete();
            $table->string('title')->nullable();
            $table->string('video_url', 1000);
            $table->string('storage_key')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('thumbnail', 1000)->nullable();
            $table->string('video_provider', 50)->default('url');
            $table->enum('status', ['processing', 'ready', 'failed'])->default('ready');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_videos');
    }
};
