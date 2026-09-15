<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationDelivery extends Model
{
    protected $fillable = [
        'user_notification_id',
        'channel',
        'recipient',
        'provider',
        'status',
        'provider_reference',
        'failure_message',
        'dispatched_at',
    ];

    protected function casts(): array
    {
        return [
            'dispatched_at' => 'datetime',
        ];
    }

    public function notification()
    {
        return $this->belongsTo(UserNotification::class, 'user_notification_id');
    }
}
