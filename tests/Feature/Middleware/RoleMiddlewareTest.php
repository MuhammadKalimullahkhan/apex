<?php

namespace Tests\Feature\Middleware;

use App\Models\Company;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $employee;

    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::factory()->create();
        $adminRole = UserRole::factory()->create([
            'role_name' => 'admin',
            'company_id' => $this->company->company_id,
        ]);
        $employeeRole = UserRole::factory()->create([
            'role_name' => 'employee',
            'company_id' => $this->company->company_id,
        ]);

        $this->admin = User::factory()->create([
            'company_id' => $this->company->company_id,
            'role_id' => $adminRole->role_id,
        ]);

        $this->employee = User::factory()->create([
            'company_id' => $this->company->company_id,
            'role_id' => $employeeRole->role_id,
        ]);
    }

    public function test_admin_can_access_admin_routes()
    {
        $this->actingAs($this->admin);

        Route::get('/admin', function () {
            return 'Success';
        })->middleware('role:admin');

        $response = $this->get('/admin');
        $response->assertSee('Success');
    }

    public function test_employee_cannot_access_admin_routes()
    {
        $this->actingAs($this->employee);

        Route::get('/admin', function () {
            return 'Success';
        })->middleware('role:admin');

        $response = $this->get('/admin');
        $response->assertStatus(403);
    }
}
