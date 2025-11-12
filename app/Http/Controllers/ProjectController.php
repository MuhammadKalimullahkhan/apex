<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Company;
use App\Models\Project;
use App\Models\Status;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $projectsQuery = Project::query()
            ->where('company_id', $user->company_id)
            ->with(['company', 'status', 'client', 'manager']);

        // Admins or users with wildcard access see all projects
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects')) {
            $projectsQuery->where('project_manager_id', $user->id);
        }

        return Inertia::render('projects/index', [
            'projects' => $projectsQuery->paginate(10),
        ]);
    }

    public function create()
    {
        $user = auth()->user();

        // Filter clients by company if user doesn't have wildcard access
        $clientsQuery = Client::query();
        if (! $user->hasWildcardAccess('clients')) {
            $clientsQuery->where('company_id', $user->company_id);
        }

        return Inertia::render('projects/upsert', [
            'companies' => Company::where('company_id', $user->company_id)->get(['company_id', 'company_name']),
            'clients' => $clientsQuery->get(['client_id', 'name']),
            'statuses' => Status::all(['status_id', 'status_name']),
            'users' => User::where('company_id', $user->company_id)->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status_id' => 'required|exists:statuses,status_id',
            'project_manager_id' => 'required|exists:users,id',
            'client_id' => 'required|exists:clients,client_id',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        // Verify client belongs to user's company or user has wildcard access
        $client = Client::findOrFail($data['client_id']);
        if (! $user->hasWildcardAccess('clients') && $client->company_id !== $user->company_id) {
            abort(403, 'You cannot create projects for this client.');
        }

        Project::create($data);

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function edit(Project $project)
    {
        $user = auth()->user();

        // Admins can access any project
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects') && $project->project_manager_id !== $user->id) {
            abort(403, 'You cannot access this project.');
        }

        // Filter clients by company if user doesn't have wildcard access
        $clientsQuery = Client::query();
        if (! $user->hasWildcardAccess('clients')) {
            $clientsQuery->where('company_id', $user->company_id);
        }

        return Inertia::render('projects/upsert', [
            'project' => $project->load(['company', 'status', 'client', 'manager']),
            'companies' => Company::where('company_id', $user->company_id)->get(['company_id', 'company_name']),
            'clients' => $clientsQuery->get(['client_id', 'name']),
            'statuses' => Status::all(['status_id', 'status_name']),
            'users' => User::where('company_id', $user->company_id)->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $user = auth()->user();

        // Admins can modify any project
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects') && $project->project_manager_id !== $user->id) {
            abort(403, 'You cannot modify this project.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status_id' => 'required|exists:statuses,status_id',
            'project_manager_id' => 'required|exists:users,id',
            'client_id' => 'required|exists:clients,client_id',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        // Verify client belongs to user's company if changed
        if ($data['client_id'] !== $project->client_id) {
            $client = Client::findOrFail($data['client_id']);
            if (! $user->hasWildcardAccess('clients') && $client->company_id !== $user->company_id) {
                abort(403, 'You cannot use this client for the project.');
            }
        }

        $project->update($data);

        return redirect()->route('projects.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $user = auth()->user();

        // Admins can delete any project
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects') && $project->project_manager_id !== $user->id) {
            abort(403, 'You cannot delete this project.');
        }

        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }
}
