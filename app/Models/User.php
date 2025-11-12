<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'company_id',
        'role_id',
        'email_verified_at',
        'onesignal_player_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Getters
    protected function createdAt(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => Carbon::parse($value)->format('d-M-Y'),
        );
    }

    protected function updatedAt(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => Carbon::parse($value)->format('d-M-Y'),
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Has Releations
    public function notificationMsg(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function performanceMetrics(): HasMany
    {
        return $this->hasMany(PerformanceMetric::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'company_id', 'company_id');
    }

    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function managedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'project_manager_id');
    }

    // Belongs to Releations
    public function role(): BelongsTo
    {
        return $this->belongsTo(UserRole::class, 'role_id', 'role_id');
    }

    public function can($permissions, $e = []): bool
    {
        $role = $this->role;

        if (! $role || empty($role->permissions)) {
            return false;
        }

        $rolePermissions = is_array($role->permissions)
            ? $role->permissions
            : json_decode($role->permissions, true);

        if (! is_array($rolePermissions)) {
            return false;
        }

        // Return true if user has at least one matching permission
        return count(array_intersect($permissions, $rolePermissions)) > 0;
    }

    /**
     * Check if user has wildcard permission for a resource (e.g., projects.*, tasks.*)
     */
    public function hasWildcardAccess(string $resource): bool
    {
        $userPermissions = (array) ($this->role?->permissions ?? []);

        return ! empty(array_filter($userPermissions, fn ($p) => $p === "{$resource}.*" || str_ends_with($p, '.*')));
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return strtolower(optional($this->role)->role_name ?? '') === 'admin';
    }

    /**
     * Check if user has developer permissions (can update tasks)
     */
    public function hasDeveloperPermission(): bool
    {
        return $this->can(['tasks.update']);
    }

    /**
     * Check if user has project manager permissions (can manage projects)
     */
    public function hasProjectManagerPermission(): bool
    {
        return $this->can(['projects.manage']);
    }

    /**
     * Check if user has HR permissions
     */
    public function hasHRPermission(): bool
    {
        return $this->can(['employees.index']);
    }

    /**
     * Check if user has finance manager permissions
     */
    public function hasFinanceManagerPermission(): bool
    {
        return $this->can(['expenses.index', 'invoices.index']);
    }

    /**
     * Check if user is a super admin
     */
    public function isSuperAdmin(): bool
    {
        return $this->role_id === 1;
    }
}
