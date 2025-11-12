<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamRouteTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_team_route()
    {
        $response = $this->get('/team');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_access_team_route()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get('/team');
        $response->assertOk();
    }
}
