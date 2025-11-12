<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use BelongsToCompany;

    protected $primaryKey = 'task_id';

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'assigned_to',
        'status_id',
        'priority',
        'due_date',
        'company_id',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class, 'task_id', 'task_id');
    }
}
