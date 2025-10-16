<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PerformanceMetric>
 */
class PerformanceMetricFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'metric_date' => $this->faker->date(),
            'completion_rate' => $this->faker->randomFloat(2, 0, 100),
            'time_on_task' => $this->faker->numberBetween(0, 12),
            'quality_score' => $this->faker->randomFloat(2, 0, 100),
        ];
    }
}
