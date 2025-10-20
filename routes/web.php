<?php
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationTypeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PerformanceAnalyticsController;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('welcome'))->name('home');
Route::inertia('team', 'team');

Route::middleware(['auth', 'verified', 'canp'])->group(function () {
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

    // Tasks Routes
    Route::resource('tasks', TaskController::class);

    // Expenses Routes
    Route::resource('expenses', ExpenseController::class);

    // Invoices Routes
    Route::resource('invoices', InvoiceController::class);

    // API: Performance Analytics
    Route::get('/api/performance/{userId?}', [PerformanceAnalyticsController::class, 'show'])
        ->name('api.performance.show');
        
    require __DIR__ . '/user/settings.php';
    require __DIR__ . '/user/dashboard.php';
    require __DIR__ . '/user/employees.php';
});
require __DIR__ . '/user/auth.php';