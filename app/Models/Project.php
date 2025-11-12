<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use BelongsToCompany;

    protected $primaryKey = 'project_id';

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status_id',
        'project_manager_id',
        'client_id',
        'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'project_manager_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id', 'project_id');
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class, 'project_id', 'project_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'project_id', 'project_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'project_id', 'project_id');
    }
}
