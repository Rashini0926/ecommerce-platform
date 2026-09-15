<?php

namespace App\Services\Notifications;

use App\Contracts\SmsGateway;
use App\Mail\OrderUpdateMail;
use App\Models\NotificationDelivery;
use App\Models\Order;
use App\Models\UserNotification;
use Illuminate\Support\Facades\Mail;
use Throwable;

class CustomerNotificationService
{
    public function __construct(private SmsGateway $smsGateway) {}

    public function sendOrderUpdate(
        Order $order,
        string $type,
        string $title,
        string $message,
    ): UserNotification {
        $order->loadMissing('user');

        $notification = UserNotification::create([
            'user_id' => $order->user_id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
        ]);

        if (config('customer_notifications.email_enabled')) {
            $this->queueEmail($notification, $order, $title, $message);
        }

        if (config('customer_notifications.sms_enabled')) {
            $this->sendSms($notification, $order->user->phone, $message);
        }

        return $notification->load('deliveries');
    }

    private function queueEmail(
        UserNotification $notification,
        Order $order,
        string $title,
        string $message,
    ): void {
        $delivery = $this->newDelivery(
            $notification,
            'EMAIL',
            $order->user->email,
            config('mail.default'),
        );

        try {
            Mail::to($order->user->email)->queue(new OrderUpdateMail($order, $title, $message));
            $delivery->update([
                'status' => 'QUEUED',
                'dispatched_at' => now(),
            ]);
        } catch (Throwable $exception) {
            $this->markFailed($delivery, $exception);
        }
    }

    private function sendSms(
        UserNotification $notification,
        ?string $phone,
        string $message,
    ): void {
        $delivery = $this->newDelivery(
            $notification,
            'SMS',
            $phone,
            config('customer_notifications.sms_driver'),
        );

        if (! $phone) {
            $delivery->update([
                'status' => 'SKIPPED',
                'failure_message' => 'The customer does not have a phone number.',
            ]);

            return;
        }

        try {
            $result = $this->smsGateway->send($phone, $message);
            $delivery->update([
                'provider' => $result['provider'],
                'provider_reference' => $result['reference'],
                'status' => $result['status'],
                'dispatched_at' => $result['dispatched_at'],
            ]);
        } catch (Throwable $exception) {
            $this->markFailed($delivery, $exception);
        }
    }

    private function newDelivery(
        UserNotification $notification,
        string $channel,
        ?string $recipient,
        string $provider,
    ): NotificationDelivery {
        return $notification->deliveries()->create([
            'channel' => $channel,
            'recipient' => $recipient,
            'provider' => strtoupper($provider),
            'status' => 'PENDING',
        ]);
    }

    private function markFailed(NotificationDelivery $delivery, Throwable $exception): void
    {
        report($exception);

        $delivery->update([
            'status' => 'FAILED',
            'failure_message' => mb_substr($exception->getMessage(), 0, 2000),
        ]);
    }
}
