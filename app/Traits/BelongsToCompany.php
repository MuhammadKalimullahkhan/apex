<?php

namespace App\Traits;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToCompany
{
    protected static function bootBelongsToCompany(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    /**
     * Disable company scope manually (for super-admins, reports, etc.)
     */
    public function scopeAllCompanies(Builder $query): Builder
    {
        return $query->withoutGlobalScope(CompanyScope::class);
    }

    /**
     * Automatically fill company_id when creating models.
     */
    protected static function booted(): void
    {
        static::creating(function ($model) {
            if (auth()->check() && empty($model->company_id)) {
                $model->company_id = auth()->user()->company_id;
            }
        });
    }
}
