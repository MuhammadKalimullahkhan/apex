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
        $users = User::paginate(10);
        return inertia("employees/index", compact("users"));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("employees/create", [
            "user" => null,
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
            "name" => "required|string|max:255",
            "email" => "required|string|email|unique:users,email",
            "password" => "required|string|min:8|confirmed",

            "role_id" => "required|exists:user_roles,role_id",
        ]);

        $user = User::create([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "password" => bcrypt($validated["password"]),

            "role_id" => $validated["role_id"],
            "company_id" => auth()->user()->company_id,
            "entry_user_id" => auth()->user()->id,
        ]);

        return redirect()->route("employees.index")->with("success", "User created successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(int $userId)
    {
        $user = User::with('role')->find($userId);
        return inertia("employees/show", compact("user"));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $userId)
    {
        $user = User::with('role')->find($userId);
        $roles = UserRole::get();

        return inertia("employees/update", [
            "employee" => $user,
            "roles" => $roles,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $userId)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|string|email|unique:users,email," . $userId,
            "password" => "nullable|string|min:8|confirmed",
            "role_id" => "required|exists:user_roles,role_id",
            "email_verified" => "nullable|boolean", // ✅ new
        ]);

        $user = User::findOrFail($userId);

        $user->update([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "role_id" => $validated["role_id"],
            "email_verified_at" => $request->boolean("email_verified")
                ? now()
                : null,  // ✅ set or clear verification
        ]);

        return redirect()
            ->route("employees.index")
            ->with("success", "User updated successfully.");
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $userId)
    {
        $user = User::find($userId);
        $user->notificationMsg()->delete();
        $user->delete();
        return redirect()->route("employees.index")->with("success", "User deleted successfully.");
    }
}
