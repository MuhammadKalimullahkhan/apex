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

Route::middleware(['auth', 'verified'])->group(function () {
    // Notifications
    Route::resource('notifications', NotificationController::class)
        ->middleware(['canp']);

    // Notification Types Routes
    Route::resource('notifications-types', NotificationTypeController::class)
        ->middleware(['canp']);
        
    // Role Routes
    Route::resource('roles', UserRoleController::class)
        ->middleware(['canp']);
    
    // Company Routes
    Route::resource('companies', CompanyController::class)
        ->middleware(['canp']);
    
    // Client Routes
    Route::resource('clients', ClientController::class)
        ->middleware(['canp']);
    
    // Projects Routes
    Route::resource('projects', ProjectController::class)
        ->middleware(['canp']);
    
    // Tasks Routes
    Route::resource('tasks', TaskController::class)
        ->middleware(['canp']);
    
    // Expenses Routes
    Route::resource('expenses', ExpenseController::class)
        ->middleware(['canp']);
    
    // Invoices Routes
    Route::resource('invoices', InvoiceController::class)
        ->middleware(['canp']);

    // API: Performance Analytics
    Route::get('/api/performance/{userId?}', [PerformanceAnalyticsController::class, 'show'])
        ->name('api.performance.show');
});

// User Routes
require __DIR__ . '/user/settings.php';
require __DIR__ . '/user/auth.php';
require __DIR__ . '/user/dashboard.php';
require __DIR__ . '/user/employees.php';


// Client Routes