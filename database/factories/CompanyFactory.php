<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            [
                'company_name' => $this->faker->company,
                'registration_number' => $this->faker->uuid,
                'location' => $this->faker->address,
                'business_email' => $this->faker->unique()->companyEmail,
                'website' => $this->faker->url,
                'entry_date' => now(),
            ],
        ];
    }
}
