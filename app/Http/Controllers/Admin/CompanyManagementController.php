<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Scopes\CompanyScope;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CompanyManagementController extends Controller
{
    public function index(): View
    {
        $companies = Company::withoutGlobalScope(CompanyScope::class)
            ->withCount([
                'users as users_count' => function ($query) {
                    $query->withoutGlobalScope(\App\Models\Scopes\CompanyScope::class);
                },
                'projects as projects_count' => function ($query) {
                    $query->withoutGlobalScope(\App\Models\Scopes\CompanyScope::class);
                },
                'clients as clients_count' => function ($query) {
                    $query->withoutGlobalScope(\App\Models\Scopes\CompanyScope::class);
                },
            ])
            ->latest()
            ->paginate(15);

        return view('admin.companies.index', compact('companies'));
    }

    public function create(): View
    {
        return view('admin.companies.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'business_email' => 'required|email|unique:companies,business_email',
            'website' => 'nullable|url|max:255',
            'is_enabled' => 'boolean',
        ]);

        Company::create($validated);

        return redirect()->route('admin.companies.index')
            ->with('success', 'Company created successfully.');
    }

    public function show(string $company): View
    {
        $company = Company::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
            ->findOrFail($company);

        $company->load([
            'users' => function ($query) {
                $query->withoutGlobalScope(\App\Models\Scopes\CompanyScope::class);
            },
            'users.role' => function ($query) {
                $query->withoutGlobalScope(\App\Models\Scopes\CompanyScope::class);
            },
            'projects' => function ($query) {
                $query->withoutGlobalScope(\App\Models\Scopes\CompanyScope::class);
            },
            'projects.status',
            'clients' => function ($query) {
                $query->withoutGlobalScope(\App\Models\Scopes\CompanyScope::class);
            },
        ]);

        return view('admin.companies.show', compact('company'));
    }

    public function edit(string $company): View
    {
        $company = Company::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
            ->findOrFail($company);

        return view('admin.companies.edit', compact('company'));
    }

    public function update(Request $request, string $companyId): RedirectResponse
    {
        $company = Company::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
            ->findOrFail($companyId);

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'business_email' => 'required|email|unique:companies,business_email,'.$company->company_id.',company_id',
            'website' => 'nullable|url|max:255',
            'is_enabled' => 'boolean',
        ]);

        $company->update($validated);

        return redirect()->route('admin.companies.index')
            ->with('success', 'Company updated successfully.');
    }

    public function enable(string $company): RedirectResponse
    {
        $company = Company::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
            ->findOrFail($company);

        $company->enable();

        return redirect()->back()
            ->with('success', 'Company has been enabled successfully.');
    }

    public function disable(string $company): RedirectResponse
    {
        $company = Company::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
            ->findOrFail($company);

        $company->disable();

        return redirect()->back()
            ->with('success', 'Company has been disabled successfully. All users have been logged out.');
    }
}
