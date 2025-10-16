<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
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
        'entry_user_id',
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

    public function entryUser()
    {
        return $this->belongsTo(User::class, 'entry_user_id');
    }
}
