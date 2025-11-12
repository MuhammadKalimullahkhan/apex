<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all route names from App controllers (excluding auth & Laravel internals)
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
                $isAuth = Str::contains($controller, ['\\Auth\\', 'Fortify', 'Sanctum']);

                $name = $r['name'];
                $isAuthName = Str::is([
                    'login', 'logout', 'register',
                    'password.*', 'verification.*', 'two-factor.*', 'user.*',
                    'sanctum.*',
                ], $name);

                return $isAppController && ! $isAuth && ! $isAuthName;
            })
            ->pluck('name')
            ->unique()
            ->values();

        // Optionally, add some manually defined permissions
        $manualPermissions = [
            'dashboard.index',
            'manager',
            'developer',
            'hr',
            'client',
            'finance',
        ];

        $allPermissions = $routes->merge($manualPermissions)->unique();

        // Insert or update permissions
        foreach ($allPermissions as $permissionName) {
            Permission::firstOrCreate(['name' => $permissionName]);
        }

        $this->command->info('✅ Permissions seeded successfully: '.$allPermissions->count());
    }
}
