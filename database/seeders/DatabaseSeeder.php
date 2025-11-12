<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $this->call(PermissionSeeder::class);

        // $this->call([CompanySeeder::class, UserRoleSeeder::class, StatusSeeder::class, NotificationTypeSeeder::class, ClientSeeder::class, ProjectSeeder::class, TaskSeeder::class, InvoiceSeeder::class, ExpenseSeeder::class, NotificationSeeder::class,]);
    }
}
