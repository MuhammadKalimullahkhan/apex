<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Company;
use App\Models\Client;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['company', 'status', 'client', 'manager'])
            ->paginate(10);

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('projects/upsert', [
            'companies' => Company::all(['company_id', 'company_name']),
            'clients'   => Client::all(['client_id', 'name']),
            'statuses'  => Status::all(['status_id', 'status_name']),
            'users'     => User::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'start_date'         => 'required|date',
            'end_date'           => 'nullable|date|after_or_equal:start_date',
            'status_id'          => 'required|exists:statuses,status_id',
            'project_manager_id' => 'required|exists:users,id',
            'client_id'          => 'required|exists:clients,client_id',
            'company_id'         => 'required|exists:companies,company_id',
        ]);

        $data['entry_user_id'] = auth()->id();

        Project::create($data);

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('projects/upsert', [
            'project'   => $project->load(['company', 'status', 'client', 'manager']),
            'companies' => Company::all(['company_id', 'company_name']),
            'clients'   => Client::all(['client_id', 'name']),
            'statuses'  => Status::all(['status_id', 'status_name']),
            'users'     => User::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'description'        => 'nullable|string',
            'start_date'         => 'required|date',
            'end_date'           => 'nullable|date|after_or_equal:start_date',
            'status_id'          => 'required|exists:statuses,status_id',
            'project_manager_id' => 'required|exists:users,id',
            'client_id'          => 'required|exists:clients,client_id',
            'company_id'         => 'required|exists:companies,company_id',
        ]);

        $project->update($data);

        return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }
}
