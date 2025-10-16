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
        Schema::create('messages', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('sender_id');
            $table->text('content');
            $table->enum('resource_type', ['project', 'task', 'general']);
            $table->unsignedBigInteger('resource_id')->nullable();
            $table->boolean('is_private')->default(false);
            $table->timestamps();

            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            // resource_id references either projects.project_id or tasks.task_id when applicable; left unenforced to support polymorphism
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
