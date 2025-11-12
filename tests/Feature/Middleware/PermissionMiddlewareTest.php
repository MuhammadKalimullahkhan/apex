<?php

namespace Tests\Feature\Middleware;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Company;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class PermissionMiddlewareTest extends TestCase
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
            'permissions' => ['admin.*'],
        ]);
        $employeeRole = UserRole::factory()->create([
            'role_name' => 'employee',
            'company_id' => $this->company->company_id,
            'permissions' => ['employees.index', 'employees.show'],
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

    public function test_admin_can_access_everything()
    {
        $this->actingAs($this->admin);

        $middleware = new PermissionMiddleware;
        $request = new Request;
        $response = $middleware->handle($request, function () {
            return response('Success');
        });

        $this->assertEquals('Success', $response->getContent());
    }

    public function test_employee_can_access_allowed_routes()
    {
        $this->actingAs($this->employee);

        Route::get('/employees', function () {
            return 'Success';
        })->name('employees.index')->middleware('canp');

        $response = $this->get('/employees');
        $response->assertSee('Success');
    }

    public function test_employee_cannot_access_disallowed_routes()
    {
        $this->actingAs($this->employee);

        Route::get('/employees/create', function () {
            return 'Success';
        })->name('employees.create')->middleware('canp');

        $response = $this->get('/employees/create');
        $response->assertStatus(403);
    }
}
