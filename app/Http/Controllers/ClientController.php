<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with(['company'])
            ->paginate(10);

        return Inertia::render('clients/index', [
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        return Inertia::render('clients/upsert', [
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        Client::create($data);

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    public function edit(Client $client)
    {
        return Inertia::render('clients/upsert', [
            'client' => $client->load('company'),
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        $client->update($data);

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return redirect()->route('clients.index')->with('success', 'Client deleted successfully.');
    }
}
