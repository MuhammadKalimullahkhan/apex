<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Company extends Model
{
    use BelongsToCompany, HasFactory;

    protected $primaryKey = 'company_id';

    protected $fillable = [
        'company_name',
        'registration_number',
        'location',
        'business_email',
        'website',
        'is_enabled',
    ];

    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
            'disabled_at' => 'datetime',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class, 'company_id');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'company_id');
    }

    public function roles()
    {
        return $this->hasMany(UserRole::class, 'company_id');
    }

    public function clients()
    {
        return $this->hasMany(Client::class, 'company_id');
    }

    /**
     * Disable the company and logout all users
     */
    public function disable(): void
    {
        $this->update([
            'is_enabled' => false,
            'disabled_at' => now(),
        ]);

        // Invalidate sessions for all users in this company
        $this->users()->each(function ($user) {
            DB::table('sessions')
                ->where('user_id', $user->id)
                ->delete();
        });
    }

    /**
     * Enable the company
     */
    public function enable(): void
    {
        $this->update([
            'is_enabled' => true,
            'disabled_at' => null,
        ]);
    }
}
