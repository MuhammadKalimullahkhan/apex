<?php

use App\Http\Controllers\Admin\CompanyManagementController;
use App\Http\Controllers\Admin\SuperAdminAuthController;
use App\Http\Controllers\Admin\SuperAdminController;
use Illuminate\Support\Facades\Route;

// Super Admin Login (public routes)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:super_admin')->group(function () {
        Route::get('login', [SuperAdminAuthController::class, 'showLoginForm'])->name('login');
        Route::post('login', [SuperAdminAuthController::class, 'login']);
    });

    // Protected Super Admin Routes
    Route::middleware(['auth:super_admin', 'super_admin'])->group(function () {
        // Dashboard
        Route::get('/', [SuperAdminController::class, 'dashboard'])
            ->name('dashboard');

        // Company Management - define routes explicitly due to custom primary key
        Route::get('companies', [CompanyManagementController::class, 'index'])
            ->name('companies.index');
        Route::get('companies/create', [CompanyManagementController::class, 'create'])
            ->name('companies.create');
        Route::post('companies', [CompanyManagementController::class, 'store'])
            ->name('companies.store');
        Route::get('companies/{company}', [CompanyManagementController::class, 'show'])
            ->name('companies.show');
        Route::get('companies/{company}/edit', [CompanyManagementController::class, 'edit'])
            ->name('companies.edit');
        Route::put('companies/{company}', [CompanyManagementController::class, 'update'])
            ->name('companies.update');

        // Enable/Disable routes
        Route::post('companies/{company}/enable', [CompanyManagementController::class, 'enable'])
            ->name('companies.enable');
        Route::post('companies/{company}/disable', [CompanyManagementController::class, 'disable'])
            ->name('companies.disable');

        // Logout
        Route::post('logout', [SuperAdminAuthController::class, 'logout'])->name('logout');
    });
});
