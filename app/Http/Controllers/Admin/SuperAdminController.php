<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Scopes\CompanyScope;
use App\Models\User;

class SuperAdminController extends Controller
{
    public function dashboard(): \Illuminate\View\View
    {
        $baseQuery = Company::withoutGlobalScope(CompanyScope::class);

        $stats = [
            'total_companies' => $baseQuery->count(),
            'active_companies' => (clone $baseQuery)->where('is_enabled', true)->count(),
            'disabled_companies' => (clone $baseQuery)->where('is_enabled', false)->count(),
            'total_users' => User::withoutGlobalScope(CompanyScope::class)->count(),
            'recent_companies' => $baseQuery
                ->latest()
                ->take(5)
                ->get(),
        ];

        return view('admin.dashboard', compact('stats'));
    }
}
