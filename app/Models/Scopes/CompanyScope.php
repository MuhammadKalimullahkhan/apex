<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CompanyScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Skip filter for super-admins (role_id = 1)
            if ($user->role_id !== 1) {
                $builder->where($model->getTable().'.company_id', $user->company_id);

                // Also ensure the company is enabled
                // For models that belong to company, we need to check the company's is_enabled status
                if ($model->company) {
                    $builder->whereHas('company', function ($query) {
                        $query->where('is_enabled', true);
                    });
                }
            }
        }
    }
}
