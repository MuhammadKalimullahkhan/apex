<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip company checks for super admin routes
        if ($request->is('admin*')) {
            return $next($request);
        }

        if (! auth()->check()) {
            return $next($request);
        }

        $user = auth()->user();

        // Check if user has isSuperAdmin method or role_id = 1
        $isSuperAdmin = $user->role_id === 1;

        // Skip for super admins
        if ($isSuperAdmin) {
            return $next($request);
        }

        // Check if user's company exists and is enabled
        if (! $user->company_id || ! $user->company) {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('error', 'Your company account is not active. Please contact support.');
        }

        if (! $user->company->is_enabled) {
            auth()->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('error', 'Your company has been disabled. Please contact support.');
        }

        return $next($request);
    }
}
