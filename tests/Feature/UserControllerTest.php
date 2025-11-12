<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $employee;

    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();

        $this->company = Company::factory()->create();
        $adminRole = UserRole::factory()->create(['role_name' => 'admin', 'company_id' => $this->company->company_id]);
        $employeeRole = UserRole::factory()->create(['role_name' => 'employee', 'company_id' => $this->company->company_id]);

        $this->admin = User::factory()->create([
            'company_id' => $this->company->company_id,
            'role_id' => $adminRole->role_id,
        ]);

        $this->employee = User::factory()->create([
            'company_id' => $this->company->company_id,
            'role_id' => $employeeRole->role_id,
        ]);
    }

    public function test_admin_can_create_employee_with_verified_email()
    {
        $response = $this->actingAs($this->admin)->post(route('employees.store'), [
            'name' => 'New Employee',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role_id' => $this->employee->role_id,
            'email_verified' => true,
        ]);

        $response->assertRedirect(route('employees.index'));
        $this->assertDatabaseHas('users', [
            'name' => 'New Employee',
            'email' => 'new@example.com',
        ]);
        $this->assertNotNull(User::where('email', 'new@example.com')->first()->email_verified_at);
    }

    public function test_admin_can_update_employee()
    {
        $response = $this->actingAs($this->admin)->put(route('employees.update', $this->employee->id), [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'role_id' => $this->employee->role_id,
        ]);

        $response->assertRedirect(route('employees.index'));
        $this->assertDatabaseHas('users', [
            'id' => $this->employee->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_admin_can_delete_employee()
    {
        $response = $this->actingAs($this->admin)->delete(route('employees.destroy', $this->employee->id));

        $response->assertRedirect(route('employees.index'));
        $this->assertDatabaseMissing('users', ['id' => $this->employee->id]);
    }
}
