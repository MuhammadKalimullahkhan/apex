<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Notification extends Model
{
    protected $primaryKey = 'notification_id';
    protected $fillable = ['user_id', 'message', 'type_id', 'is_read', 'company_id', 'entry_user_id', ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function type()
    {
        return $this->belongsTo(NotificationType::class, 'type_id');
    }
}