<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'Unauthorized access.');
        }

        // Allow all access for Admins
        $roleName = optional($user->role)->role_name;
        if (in_array(strtolower((string) $roleName), ['admin'], true)) {
            return $next($request);
        }

        // Get permissions from role
        $rawPermissions = $user->role?->permissions;

        // Handle different permission formats
        if (is_string($rawPermissions)) {
            try {
                $userPermissions = json_decode($rawPermissions, true) ?? [];
            } catch (\Throwable $e) {
                $userPermissions = [];
            }
        } elseif (is_array($rawPermissions)) {
            $userPermissions = $rawPermissions;
        } else {
            $userPermissions = [];
        }

        // Default to current route name if no permissions explicitly passed
        if (empty($permissions)) {
            $routeName = Route::currentRouteName();
            $permissions = [$routeName];

            // Debug: Log what we're checking
            \Log::info('Permission check', [
                'route' => $routeName,
                'user_permissions' => $userPermissions,
                'role_name' => $roleName,
            ]);
        }

        // Normalize destroy/delete
        $permissions = array_map(function ($perm) {
            return str_replace('.delete', '.destroy', (string) $perm);
        }, $permissions);

        // Check for exact match or wildcard (e.g. users.*)
        $hasMatch = false;
        foreach ($permissions as $required) {
            if (in_array($required, $userPermissions, true)) {
                $hasMatch = true;
                break;
            }

            $section = explode('.', (string) $required)[0] ?? '';
            if ($section && in_array($section.'.*', $userPermissions, true)) {
                $hasMatch = true;
                break;
            }
        }

        if ($hasMatch) {
            return $next($request);
        }

        abort(403, 'Insufficient permissions.');
    }
}
