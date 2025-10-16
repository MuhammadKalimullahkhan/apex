<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PerformanceMetric;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class PerformanceAnalyticsController extends Controller
{
    public function show(?int $userId = null): JsonResponse
    {
        $requestingUser = Auth::user();

        $targetUserId = $userId ?? $requestingUser->id;

        // Basic role-based access: admins/PMs can view any; developer only self; client none
        $roleName = optional($requestingUser->role)->role_name;
        $isAdminOrPm = in_array(strtolower((string)$roleName), ['admin', 'pm'], true);

        if (!$isAdminOrPm && $targetUserId !== $requestingUser->id) {
            abort(403);
        }

        $metrics = PerformanceMetric::query()
            ->where('user_id', $targetUserId)
            ->orderBy('metric_date')
            ->get([
                'metric_date',
                'completion_rate',
                'time_on_task',
                'quality_score',
            ]);

        return response()->json([
            'userId' => $targetUserId,
            'metrics' => $metrics,
        ]);
    }
}
