<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use BelongsToCompany;

    protected $primaryKey = 'role_id';

    protected $fillable = ['role_name', 'permissions', 'company_id'];

    protected function casts(): array
    {
        return [
            'permissions' => 'array', // JSON field cast
        ];
    }

    // Belongs -> i am child
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    // Has -> i am parent
    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}
