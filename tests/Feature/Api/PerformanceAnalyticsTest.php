<?php

use App\Models\PerformanceMetric;
use App\Models\User;

it('forbids developers from viewing other users metrics', function () {
    $dev = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($dev);

    $this->get('/api/performance/'.$other->id)->assertForbidden();
});

it('returns metrics for self', function () {
    $dev = User::factory()->create();
    PerformanceMetric::factory()->create([
        'user_id' => $dev->id,
        'metric_date' => now()->toDateString(),
        'completion_rate' => 75.5,
        'time_on_task' => 6,
        'quality_score' => 88.2,
    ]);

    $this->actingAs($dev);

    $this->get('/api/performance')
        ->assertSuccessful()
        ->assertJsonStructure([
            'userId',
            'metrics' => [
                ['metric_date', 'completion_rate', 'time_on_task', 'quality_score']
            ],
        ]);
});
