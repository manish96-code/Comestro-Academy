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
        Schema::create('live_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('instructor_id')->nullable()->constrained('instructors')->nullOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('course_lessons')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('meeting_link', 1000)->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->string('recording_url', 1000)->nullable();
            $table->enum('status', ['scheduled', 'live', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_classes');
    }
};
