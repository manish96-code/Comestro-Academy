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
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_exam_id')->constrained('course_exams')->cascadeOnDelete();
            $table->text('question_text');
            $table->string('question_type')->default('single_choice'); // single_choice, multiple_choice, true_false
            $table->unsignedSmallInteger('marks')->default(1);
            $table->text('explanation')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
    }
};
