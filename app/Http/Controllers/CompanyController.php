<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::latest()->paginate(10);

        return Inertia::render('companies/index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        return Inertia::render('companies/upsert');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'business_email' => 'required|email|unique:companies,business_email',
            'website' => 'nullable|url',
        ]);

        Company::create($validated);

        return redirect()->route('companies.index')->with('success', 'Company created successfully.');
    }

    public function edit(Company $company)
    {
        return Inertia::render('companies/upsert', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'business_email' => 'required|email|unique:companies,business_email,'.$company->company_id.',company_id',
            'website' => 'nullable|url',
        ]);

        $company->update($validated);

        return redirect()->route('companies.index')->with('success', 'Company updated successfully.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }
}
