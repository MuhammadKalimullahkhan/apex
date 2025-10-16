<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class UserRole extends Model
{
    protected $primaryKey = 'role_id';
    protected $fillable = ['role_name', 'permissions', 'company_id', 'entry_user_id',];

    protected $casts = [
        'permissions' => 'array', // JSON field
    ];

    // Belongs -> i am child
    public function company(){
        return $this->belongsTo(Company::class,'company_id');
    }

    // Has -> i am parent
    public function users()
    {
        return $this->hasMany(User::class, 'role_id');
    }
}