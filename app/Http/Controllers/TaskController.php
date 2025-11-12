<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Document;
use App\Models\Project;
use App\Models\Status;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $tasks = Task::with(['project', 'assignee', 'status', 'company']);

        // Admins or users with wildcard access see all tasks
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('tasks')) {
            $tasks->where(function ($query) use ($user) {
                // Show tasks assigned to the user
                $query->where('assigned_to', $user->id);
                // OR tasks in projects managed by the user
                $query->orWhere(function ($q) use ($user) {
                    $q->whereHas('project', function ($subQ) use ($user) {
                        $subQ->where('project_manager_id', $user->id);
                    });
                });
            });
        }

        return Inertia::render('tasks/index', [
            'tasks' => $tasks->paginate(10),
            'statuses' => Status::all(['status_id', 'status_name']),
        ]);
    }

    public function create()
    {
        $user = auth()->user();

        $projectsQuery = Project::query()->where('company_id', $user->company_id);

        // If user doesn't have wildcard access, only show projects they manage
        if (! $user->hasWildcardAccess('projects')) {
            $projectsQuery->where('project_manager_id', $user->id);
        }

        $companiesQuery = Company::query()->where('company_id', $user->company_id);
        // Only show users with Developer role
        $usersQuery = User::where('company_id', $user->company_id)
            ->whereHas('role', function ($q) {
                $q->where('role_name', 'Developer');
            });

        return Inertia::render('tasks/upsert', [
            'projects' => $projectsQuery->get(['project_id', 'name']),
            'statuses' => Status::all(['status_id', 'status_name']),
            'users' => $usersQuery->get(['id', 'name']),
            'companies' => $companiesQuery->get(['company_id', 'company_name']),
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $data = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status_id' => 'required|exists:statuses,status_id',
            'priority' => 'nullable|string|max:50',
            'due_date' => 'nullable|date',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        // Verify user has access to this project
        $project = Project::findOrFail($data['project_id']);
        if (! $user->hasWildcardAccess('projects') && $project->project_manager_id !== $user->id) {
            abort(403, 'You cannot create tasks for this project.');
        }

        Task::create($data);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    public function edit(Task $task)
    {
        $user = auth()->user();

        // Admins can access any task
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('tasks')) {
            $canAccess = $task->assigned_to === $user->id
                       || $task->project->project_manager_id === $user->id;

            if (! $canAccess) {
                abort(403, 'You cannot access this task.');
            }
        }

        $projectsQuery = Project::query()->where('company_id', $user->company_id);

        // Filter projects based on permission
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('projects')) {
            $projectsQuery->where('project_manager_id', $user->id);
        }

        $companiesQuery = Company::query()->where('company_id', $user->company_id);
        // Only show users with Developer role
        $usersQuery = User::where('company_id', $user->company_id)
            ->whereHas('role', function ($q) {
                $q->where('role_name', 'Developer');
            });

        return Inertia::render('tasks/upsert', [
            'task' => $task->load(['project', 'assignee', 'status', 'company']),
            'projects' => $projectsQuery->get(['project_id', 'name']),
            'statuses' => Status::all(['status_id', 'status_name']),
            'users' => $usersQuery->get(['id', 'name']),
            'companies' => $companiesQuery->get(['company_id', 'company_name']),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $user = auth()->user();

        // Check if user can modify this task
        if (! $user->hasWildcardAccess('tasks')) {
            $canModify = $task->assigned_to === $user->id
                       || $task->project->project_manager_id === $user->id;

            if (! $canModify) {
                abort(403, 'You cannot modify this task.');
            }
        }
        // If the only key in the request is 'status_id', update the task's status
        if (
            count($request->all()) === 1 &&
            $request->has('status_id')
        ) {
            $task->update(['status_id' => $request->input('status_id')]);

            return back()->with('success', 'Task status updated successfully.');
        }
        $data = $request->validate([
            'project_id' => 'required|exists:projects,project_id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status_id' => 'required|exists:statuses,status_id',
            'priority' => 'nullable|string|max:50',
            'due_date' => 'nullable|date',
            'company_id' => 'required|exists:companies,company_id',
        ]);

        // Verify user has access to the new project if changed
        if (isset($data['project_id']) && $data['project_id'] !== $task->project_id) {
            $project = Project::findOrFail($data['project_id']);
            if (! $user->hasWildcardAccess('projects') && $project->project_manager_id !== $user->id) {
                abort(403, 'You cannot move tasks to this project.');
            }
        }

        $task->update($data);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $user = auth()->user();

        // Admins can delete any task
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('tasks')) {
            $canDelete = $task->assigned_to === $user->id
                       || $task->project->project_manager_id === $user->id;

            if (! $canDelete) {
                abort(403, 'You cannot delete this task.');
            }
        }

        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }

    public function show(Task $task)
    {
        $user = auth()->user();

        // Check if user can view this task
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('tasks')) {
            $canAccess = $task->assigned_to === $user->id
                       || $task->project->project_manager_id === $user->id;

            if (! $canAccess) {
                abort(403, 'You cannot view this task.');
            }
        }

        return Inertia::render('tasks/show', [
            'task' => $task->load(['project', 'assignee', 'status', 'company', 'documents.uploadedBy']),
        ]);
    }

    public function uploadDocument(Request $request, Task $task)
    {
        $user = auth()->user();

        // Check if user can upload to this task
        if (! $user->isAdmin() && ! $user->hasWildcardAccess('tasks')) {
            $canUpload = $task->assigned_to === $user->id
                       || $task->project->project_manager_id === $user->id;

            if (! $canUpload) {
                abort(403, 'You cannot upload documents to this task.');
            }
        }

        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $filename = time().'_'.$file->getClientOriginalName();
        $path = $file->storeAs('documents/tasks', $filename, 'public');

        Document::create([
            'project_id' => $task->project_id,
            'task_id' => $task->task_id,
            'uploaded_by_id' => $user->id,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
        ]);

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function downloadDocument(Document $document)
    {
        $user = auth()->user();

        // Check if user can view this document
        $canView = false;

        if ($user->isAdmin() || $user->hasWildcardAccess('tasks')) {
            $canView = true;
        } elseif ($document->task_id) {
            $task = $document->task;
            $canView = $task->assigned_to === $user->id
                    || $task->project->project_manager_id === $user->id
                    || $document->uploaded_by_id === $user->id;
        } else {
            // For project-level documents
            $project = $document->project;
            $canView = $project->project_manager_id === $user->id
                    || $document->uploaded_by_id === $user->id;
        }

        if (! $canView) {
            abort(403, 'You cannot download this document.');
        }

        if (! Storage::disk('public')->exists($document->file_path)) {
            abort(404, 'File not found.');
        }

        return response()->download(storage_path('app/public/'.$document->file_path), $document->file_name);
    }

    public function deleteDocument(Document $document)
    {
        $user = auth()->user();

        // Check if user can delete this document
        $canDelete = false;

        if ($user->isAdmin() || $user->hasWildcardAccess('tasks')) {
            $canDelete = true;
        } elseif ($document->task_id) {
            $task = $document->task;
            $canDelete = $task->assigned_to === $user->id
                      || $task->project->project_manager_id === $user->id
                      || $document->uploaded_by_id === $user->id;
        } else {
            // For project-level documents
            $project = $document->project;
            $canDelete = $project->project_manager_id === $user->id
                      || $document->uploaded_by_id === $user->id;
        }

        if (! $canDelete) {
            abort(403, 'You cannot delete this document.');
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return back()->with('success', 'Document deleted successfully.');
    }
}
