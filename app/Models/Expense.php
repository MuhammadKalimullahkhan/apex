<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use BelongsToCompany;

    protected $primaryKey = 'expense_id';

    protected $fillable = [
        'project_id',
        'name',
        'amount',
        'date',
        'company_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
