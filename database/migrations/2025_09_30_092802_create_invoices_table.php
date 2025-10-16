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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id('invoice_id');
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('client_id')->nullable();
            $table->decimal('amount', 12, 2);
            $table->unsignedBigInteger('status_id')->nullable();
            $table->date('due_date')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('entry_user_id')->nullable();
            
            $table->timestamps();

            $table->foreign('project_id')->references('project_id')->on('projects');
            $table->foreign('client_id')->references('client_id')->on('clients');
            $table->foreign('status_id')->references('status_id')->on('statuses');
            $table->foreign('company_id')->references('company_id')->on('companies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
