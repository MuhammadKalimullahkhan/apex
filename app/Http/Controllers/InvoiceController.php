<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['project', 'client', 'status', 'company'])
            ->paginate(10);

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
        ]);
    }

    public function create()
    {
        return Inertia::render('invoices/upsert', [
            'projects' => Project::all(['project_id', 'name']),
            'clients' => Client::all(['client_id', 'name']),
            'statuses' => Status::all(['status_id', 'status_name']),
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'client_id' => 'required|exists:clients,client_id',
            'amount' => 'required|numeric',
            'status_id' => 'required|exists:statuses,status_id',
            'due_date' => 'required|date',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        Invoice::create($data);

        return redirect()->route('invoices.index')->with('success', 'Invoice created successfully.');
    }

    public function edit(Invoice $invoice)
    {
        return Inertia::render('invoices/upsert', [
            'invoice' => $invoice->load(['project', 'client', 'status', 'company']),
            'projects' => Project::all(['project_id', 'name']),
            'clients' => Client::all(['client_id', 'name']),
            'statuses' => Status::all(['status_id', 'status_name']),
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'client_id' => 'required|exists:clients,client_id',
            'amount' => 'required|numeric',
            'status_id' => 'required|exists:statuses,status_id',
            'due_date' => 'required|date',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        $invoice->update($data);

        return redirect()->route('invoices.index')->with('success', 'Invoice updated successfully.');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return redirect()->route('invoices.index')->with('success', 'Invoice deleted successfully.');
    }
}
