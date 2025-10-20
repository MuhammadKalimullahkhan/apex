<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Route;

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

        // Decode permissions (assumes JSON string in DB)
        $rawPermissions = $user->role?->permissions ?? '[]';

        try {
            $userPermissions = json_decode(stripslashes($rawPermissions), true) ?? [];
        } catch (\Throwable $e) {
            $userPermissions = [];
        }

        // Ensure it's an array
        if (!is_array($userPermissions)) {
            $userPermissions = [];
        }

        // Default to current route name if no permissions explicitly passed
        if (empty($permissions)) {
            $permissions = [Route::currentRouteName()];
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
            if ($section && in_array($section . '.*', $userPermissions, true)) {
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




// namespace App\Http\Middleware;

// use Closure;
// use Illuminate\Http\Request;
// use Symfony\Component\HttpFoundation\Response;
// use Illuminate\Support\Facades\Route;

// class PermissionMiddleware
// {
//     /**
//      * Handle an incoming request.
//      *
//      * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
//      */
//     public function handle(Request $request, Closure $next, ...$permissions): Response
//     {
//         $user = $request->user();

//         if (! $user) {
//             abort(403, 'Unauthorized access.');
//         }

//         // Admins can access everything
//         $roleName = optional($user->role)->role_name;
//         if (in_array(strtolower((string) $roleName), ['admin'], true)) {
//             return $next($request);
//         }
        
//         $userPermissions = (array) ($user->role?->permissions ?? []);
        
//         // Default to current route name if no explicit permission was provided
//         $routeName = Route::currentRouteName();
//         if (empty($permissions)) {
//             $permissions = [$routeName];
//             dd($user->role?->permissions);
//         }

//         // Normalize common synonyms (destroy/delete)
//         $permissions = array_map(function ($perm) {
//             return str_replace('.delete', '.destroy', (string) $perm);
//         }, $permissions);

//         // Match exact or wildcard (e.g. roles.*)
//         $hasMatch = false;
//         foreach ($permissions as $required) {
//             if (in_array($required, $userPermissions, true)) {
//                 $hasMatch = true; break;
//             }

//             // if user has wildcard and required is exact
//             $section = explode('.', (string) $required)[0] ?? '';
//             if ($section && in_array($section.'.*', $userPermissions, true)) {
//                 $hasMatch = true; break;
//             }
//         }

//         if ($hasMatch) {
//             return $next($request);
//         }

//         abort(403, 'Insufficient permissions.');
//     }
// }
