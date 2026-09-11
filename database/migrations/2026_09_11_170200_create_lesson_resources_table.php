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
        Schema::create('lesson_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('course_lessons')->cascadeOnDelete();
            $table->string('title');
            $table->string('file_url', 1000)->nullable();
            $table->string('storage_key')->nullable();
            $table->string('resource_type', 50)->default('pdf');
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('external_url', 1000)->nullable();
            $table->unsignedInteger('sort_order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_resources');
    }
};
