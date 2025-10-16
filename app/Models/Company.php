<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'company_id';

    protected $fillable = [
        'company_name',
        'registration_number',
        'location',
        'business_email',
        'website',
        'entry_user_id',
        
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'company_id');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'company_id');
    }
}