<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use BelongsToCompany;

    protected $primaryKey = 'invoice_id';

    protected $fillable = [
        'project_id',
        'client_id',
        'amount',
        'status_id',
        'due_date',
        'company_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
