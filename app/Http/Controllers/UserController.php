<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $company_id = auth()->user()->company_id;
        $users = User::where('company_id', $company_id)->with('role')->paginate(10);

        return inertia('employees/index', compact('users'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('employees/create', [
            'user' => null,
            'roles' => UserRole::get(),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Example validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:user_roles,role_id',
            'email_verified' => 'nullable|boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role_id' => $validated['role_id'],
            'company_id' => auth()->user()->company_id,
            'email_verified_at' => $request->boolean('email_verified') ? now() : null,
        ]);

        return redirect()->route('employees.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(int $userId)
    {
        $user = User::where('company_id', auth()->user()->company_id)->with('role')->find($userId);
        if ($user == null) {
            return back();
        }

        return inertia('employees/show', compact('user'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $userId)
    {
        $user = User::where('company_id', auth()->user()->company_id)->with('role')->find($userId);
        if ($user == null) {
            return back();
        }
        $roles = UserRole::get();

        return inertia('employees/update', [
            'employee' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $userId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email,'.$userId,
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'required|exists:user_roles,role_id',
            'email_verified' => 'nullable|boolean', // ✅ new
        ]);

        $user = User::where('company_id', auth()->user()->company_id)->find($userId);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
            'email_verified_at' => $request->boolean('email_verified')
                ? now()
                : null,  // ✅ set or clear verification
        ]);

        return redirect()
            ->route('employees.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $userId)
    {
        $user = User::where('company_id', auth()->user()->company_id)->find($userId);
        if ($user == null) {
            return back();
        }

        $user->notificationMsg()->delete();
        $user->delete();

        return redirect()->route('employees.index')->with('success', 'User deleted successfully.');
    }
}
