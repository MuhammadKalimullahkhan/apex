<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class UserRoleController extends Controller
{
    // List all roles
    public function index()
    {
        $roles = UserRole::with('company')->paginate(10);
        return Inertia::render('roles/index', [
            'roles' => $roles
        ]);
    }

    // Show create form
    public function create()
    {
        $routes = collect(Route::getRoutes())
            ->map(function ($r) {
                return [
                    'name' => $r->getName(),
                    'controller' => $r->getAction('controller'),
                ];
            })
            ->filter(fn ($r) => ! empty($r['name']))
            // include only app controllers (exclude vendor), but also exclude auth/fortify
            ->filter(function ($r) {
                $controller = (string) ($r['controller'] ?? '');
                $isAppController = Str::startsWith($controller, 'App\\');
                $isAuth = Str::contains($controller, ['\\Auth\\', 'Fortify']);

                $name = $r['name'];
                $isAuthName = Str::is([
                    'login', 'logout', 'register',
                    'password.*', 'verification.*', 'two-factor.*', 'user.*',
                    'sanctum.*',
                ], $name);

                return $isAppController && ! $isAuth && ! $isAuthName;
            })
            ->pluck('name')
            ->values();

        return Inertia::render('roles/upsert', [
            'allRoutes' => $routes,
        ]);
    }

    // Store role
    public function store(Request $request)
    {
        $validated = $request->validate([
            'role_name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'company_id' => 'nullable|exists:companies,company_id',
        ]);

        UserRole::create([
            'role_name' => $validated['role_name'],
            'permissions' => !empty($validated['permissions']) ? json_encode($validated['permissions']) : null,
            'company_id' => auth()->user()->company_id,
            'entry_user_id' => auth()->user()->id,
        ]);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    // Show role details
    public function show(UserRole $role)
    {
        return Inertia::render('roles/show', [
            'role' => $role
        ]);
    }

    // Show edit form
    public function edit(int $roleId)
    {
        $routes = collect(Route::getRoutes())
            ->map(function ($r) {
                return [
                    'name' => $r->getName(),
                    'controller' => $r->getAction('controller'),
                ];
            })
            ->filter(fn ($r) => ! empty($r['name']))
            ->filter(function ($r) {
                $controller = (string) ($r['controller'] ?? '');
                $isAppController = Str::startsWith($controller, 'App\\');
                $isAuth = Str::contains($controller, ['\\Auth\\', 'Fortify']);

                $name = $r['name'];
                $isAuthName = Str::is([
                    'login', 'logout', 'register',
                    'password.*', 'verification.*', 'two-factor.*', 'user.*',
                    'sanctum.*',
                ], $name);

                return $isAppController && ! $isAuth && ! $isAuthName;
            })
            ->pluck('name')
            ->values();

        return Inertia::render('roles/upsert', [
            'role' => UserRole::with('company')->find($roleId),
            'allRoutes' => $routes,
        ]);
    }

    // Update role
    public function update(Request $request, UserRole $role)
    {
        $validated = $request->validate([
            'role_name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'company_id' => 'nullable|exists:companies,company_id',
        ]);

        $role->update([
            'role_name' => $validated['role_name'],
            'permissions' => !empty($validated['permissions']) ? json_encode($validated['permissions']) : null,
            'company_id' => $validated['company_id'] ?? $role->company_id,
        ]);

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    // Delete role
    public function destroy(UserRole $role)
    {
        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
