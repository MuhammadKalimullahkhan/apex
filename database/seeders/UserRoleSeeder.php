<?php

namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'role_name' => 'Admin',
                'permissions' => [
                    'users.manage',
                    'projects.manage',
                    'expenses.manage',
                    'view.reports',
                ],
            ],
            [
                'role_name' => 'Project Manager',
                'permissions' => [
                    'projects.manage',
                    'tasks.assign',
                    'view.reports',
                ],
            ],
            [
                'role_name' => 'Developer',
                'permissions' => [
                    'tasks.update',
                    'documents.upload',
                ],
            ],
            [
                'role_name' => 'Client',
                'permissions' => [
                    'projects.view',
                ],
            ],
            [
                'role_name' => 'HR',
                'permissions' => [
                    'users.view',
                    'expenses.view',
                    'view.reports',
                ],
            ],
            [
                'role_name' => 'Employee',
                'permissions' => [
                    'projects.view',
                    'expenses.submit',
                ],
            ],
        ];

        foreach ($roles as $role) {
            UserRole::firstOrCreate(['role_name' => $role['role_name']], $role);
        }
    }
}
