<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends Model
{
    use BelongsToCompany;

    protected $primaryKey = 'client_id';

    protected $fillable = [
        'name',
        'contact_number',
        'address',
        'company_id',

    ];

    public function projects()
    {
        return $this->hasMany(Project::class, 'client_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'client_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }
}
