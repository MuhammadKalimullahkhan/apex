<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $primaryKey = 'expense_id';

    protected $fillable = [
        'project_id',
        'name',
        'amount',
        'date',
        'company_id',
        'entry_user_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function entryUser()
    {
        return $this->belongsTo(User::class, 'entry_user_id');
    }
}
