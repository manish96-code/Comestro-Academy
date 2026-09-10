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
        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();

            // Structure & Organization
            $table->string('module_name')->default('Module 1');
            $table->string('title');
            $table->integer('order')->default(1);

            // Video Content
            $table->string('video_url')->nullable();
            $table->string('duration')->nullable();
            $table->boolean('is_free_preview')->default(false);

            // Notes, Study Material & Attachments
            $table->string('notes_file')->nullable();
            $table->string('notes_title')->nullable();
            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_lessons');
    }
};
