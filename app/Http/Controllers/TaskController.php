<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\Status;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['project', 'assignee', 'status', 'company'])
            ->paginate(10);

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
        ]);
    }

    public function create()
    {
        return Inertia::render('tasks/upsert', [
            'projects'  => Project::all(['project_id', 'name']),
            'statuses'  => Status::all(['status_id', 'status_name']),
            'users'     => User::all(['id', 'name']),
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id'  => 'required|exists:projects,project_id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status_id'   => 'required|exists:statuses,status_id',
            'priority'    => 'nullable|string|max:50',
            'due_date'    => 'nullable|date',
            'company_id'  => 'required|exists:companies,company_id',
        ]);

        $data['entry_user_id'] = auth()->id();

        Task::create($data);

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    public function edit(Task $task)
    {
        return Inertia::render('tasks/upsert', [
            'task'      => $task->load(['project', 'assignee', 'status', 'company']),
            'projects'  => Project::all(['project_id', 'name']),
            'statuses'  => Status::all(['status_id', 'status_name']),
            'users'     => User::all(['id', 'name']),
            'companies' => Company::all(['company_id', 'company_name']),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'project_id'  => 'required|exists:projects,project_id',
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'status_id'   => 'required|exists:statuses,status_id',
            'priority'    => 'nullable|string|max:50',
            'due_date'    => 'nullable|date',
            'company_id'  => 'required|exists:companies,company_id',
        ]);

        $task->update($data);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}
