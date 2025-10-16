<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $primaryKey = 'status_id';

    protected $fillable = [
        'status_name',
        'company_id',
        'entry_user_id',
        
    ];
}
