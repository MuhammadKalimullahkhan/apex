<?php

use Illuminate\Support\Facades\Route;

use App\Models\Notification;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return inertia('dashboard', [
            'stats' => [
                'projects'   => Project::count(),
                'employees'  => User::count(),
                'tasks'      => Task::count(),
            ],
            'recentProjects' => Project::latest()->take(5)->get(['project_id', 'name', 'status_id', 'end_date']),
            'notifications'  => Notification::latest()->take(5)->get(['message','is_read', 'created_at']),
        ]);
    })->name('dashboard');
});