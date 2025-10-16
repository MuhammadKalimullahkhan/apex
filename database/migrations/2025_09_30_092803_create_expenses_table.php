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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id('expense_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->string('name');
            $table->decimal('amount', 12, 2);
            $table->date('date')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('entry_user_id')->nullable();
            
            $table->timestamps();

            $table->foreign('project_id')->references('project_id')->on('projects');
            $table->foreign('company_id')->references('company_id')->on('companies');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
