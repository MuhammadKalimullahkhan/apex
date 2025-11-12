<?php

namespace Tests\Feature\Auth;

use App\Models\Company;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register()
    {
        Company::factory()->create(['company_id' => 1]);
        UserRole::factory()->create(['role_id' => 2, 'company_id' => 1]);

        $response = $this->post(route('register'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'company_id' => 1,
            'role_id' => 2,
        ]);
    }
}
