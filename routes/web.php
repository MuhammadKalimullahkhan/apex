<?php

use App\Http\Controllers\Api\PerformanceAnalyticsController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FinancialReportController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationTypeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectReportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('team', 'team');

    Route::middleware(['canp'])->group(function () {

        // Notifications
        Route::resource('notifications', NotificationController::class);

        // Notification Types Routes
        Route::resource('notifications-types', NotificationTypeController::class);

        // Role Routes
        Route::resource('roles', UserRoleController::class);

        // Company Routes
        Route::resource('companies', CompanyController::class);

        // Client Routes
        Route::resource('clients', ClientController::class);

        // Projects Routes
        Route::resource('projects', ProjectController::class);

        // Project Reports Routes
        Route::get('reports/projects', [ProjectReportController::class, 'index'])
            ->name('reports.projects.index');
        Route::get('reports/projects/{project}', [ProjectReportController::class, 'show'])
            ->name('reports.projects.show');

        // Project Report Exports
        Route::get('reports/projects/{project}/export/pdf', [ProjectReportController::class, 'downloadProjectPdf'])
            ->name('reports.projects.pdf');
        Route::get('reports/projects/export/csv', [ProjectReportController::class, 'downloadProjectCsv'])
            ->name('reports.projects.csv');

        // Tasks Routes
        Route::resource('tasks', TaskController::class);

        // Task Documents Routes
        Route::post('tasks/{task}/documents', [TaskController::class, 'uploadDocument'])
            ->name('tasks.documents.store');
        Route::get('documents/{document}/download', [TaskController::class, 'downloadDocument'])
            ->name('documents.download');
        Route::delete('documents/{document}', [TaskController::class, 'deleteDocument'])
            ->name('documents.destroy');

        // Expenses Routes
        Route::resource('expenses', ExpenseController::class);

        // Invoices Routes
        Route::resource('invoices', InvoiceController::class);

        // Financial Reports Routes
        Route::get('reports/financial', [FinancialReportController::class, 'index'])
            ->name('reports.financial.index');
        Route::get('reports/financial/expenses', [FinancialReportController::class, 'expenses'])
            ->name('reports.financial.expenses');
        Route::get('reports/financial/invoices', [FinancialReportController::class, 'invoices'])
            ->name('reports.financial.invoices');

        // Financial Report Exports
        Route::get('reports/financial/export/pdf', [FinancialReportController::class, 'downloadPdf'])
            ->name('reports.financial.pdf');
        Route::get('reports/financial/export/csv', [FinancialReportController::class, 'downloadCsv'])
            ->name('reports.financial.csv');

        // API: Performance Analytics
        Route::get('/api/performance/{userId?}', [PerformanceAnalyticsController::class, 'show'])
            ->name('api.performance.show');

        require __DIR__.'/user/employees.php';
    });

    require __DIR__.'/user/dashboard.php';
    require __DIR__.'/user/settings.php';
});
require __DIR__.'/user/auth.php';
