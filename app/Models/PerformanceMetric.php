<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PerformanceMetric extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'metric_date',
        'completion_rate',
        'time_on_task',
        'quality_score',
    ];

    protected function casts(): array
    {
        return [
            'metric_date' => 'date',
            'completion_rate' => 'decimal:2',
            'quality_score' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
