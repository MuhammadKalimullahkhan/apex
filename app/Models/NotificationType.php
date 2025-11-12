<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotificationType extends Model
{
    use BelongsToCompany, HasFactory;

    protected $primaryKey = 'type_id';

    protected $fillable = [
        'type_name',
        'company_id',
    ];

    // BelongsTo relations
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }

    // HasMany relation
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'type_id', 'type_id');
    }
}
