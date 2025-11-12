<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Nette\Utils\Random;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserRole>
 */
class UserRoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'role_name' => $this->faker->jobTitle,
            'permissions' => json_encode([
                'read',
                'write',
            ]),
            'company_id' => (int) Random::generate(1, '1-3'),
            'entry_date' => now(),
        ];
    }
}
