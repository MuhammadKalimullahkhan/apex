<?php

namespace App\Models;

use App\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use BelongsToCompany;

    protected $primaryKey = 'notification_id';

    protected $fillable = ['user_id', 'message', 'type_id', 'is_read', 'company_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function type()
    {
        return $this->belongsTo(NotificationType::class, 'type_id');
    }
}
