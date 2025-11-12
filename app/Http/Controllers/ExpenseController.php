<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Expense;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::with(['project', 'company'])
            ->paginate(10);

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
        ]);
    }

    public function create()
    {
        return Inertia::render('expenses/upsert', [
            'projects' => Project::all(['project_id', 'name']),
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        Expense::create($data);

        return redirect()->route('expenses.index')->with('success', 'Expense created successfully.');
    }

    public function edit(Expense $expense)
    {
        return Inertia::render('expenses/upsert', [
            'expense' => $expense->load(['project', 'company']),
            'projects' => Project::all(['project_id', 'name']),
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function update(Request $request, Expense $expense)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        $expense->update($data);

        return redirect()->route('expenses.index')->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return redirect()->route('expenses.index')->with('success', 'Expense deleted successfully.');
    }
}
