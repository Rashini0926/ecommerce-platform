<?php

namespace Tests\Feature;

use App\Mail\OrderUpdateMail;
use App\Models\Order;
use App\Models\User;
use App\Services\Notifications\CustomerNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationDeliveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_update_creates_in_app_email_and_demo_sms_deliveries(): void
    {
        Mail::fake();
        [$customer, $order] = $this->orderData('0771234567');

        $notification = app(CustomerNotificationService::class)->sendOrderUpdate(
            $order,
            'SHIPPING',
            'Your order has shipped',
            'Your order is on its way.',
        );

        $this->assertDatabaseHas('user_notifications', [
            'id' => $notification->id,
            'user_id' => $customer->id,
            'type' => 'SHIPPING',
        ]);
        $this->assertDatabaseHas('notification_deliveries', [
            'user_notification_id' => $notification->id,
            'channel' => 'EMAIL',
            'recipient' => $customer->email,
            'status' => 'QUEUED',
        ]);
        $this->assertDatabaseHas('notification_deliveries', [
            'user_notification_id' => $notification->id,
            'channel' => 'SMS',
            'recipient' => $customer->phone,
            'provider' => 'DEMO_LOG',
            'status' => 'SENT',
        ]);
        Mail::assertQueued(OrderUpdateMail::class, fn (OrderUpdateMail $mail) => $mail->hasTo($customer->email));

        Sanctum::actingAs($customer);
        $this->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('notifications.data.0.id', $notification->id)
            ->assertJsonCount(2, 'notifications.data.0.deliveries');
    }

    public function test_sms_delivery_is_skipped_when_customer_has_no_phone_number(): void
    {
        Mail::fake();
        [, $order] = $this->orderData(null);

        $notification = app(CustomerNotificationService::class)->sendOrderUpdate(
            $order,
            'ORDER',
            'Order placed',
            'Your order was placed successfully.',
        );

        $this->assertDatabaseHas('notification_deliveries', [
            'user_notification_id' => $notification->id,
            'channel' => 'SMS',
            'recipient' => null,
            'status' => 'SKIPPED',
        ]);
    }

    private function orderData(?string $phone): array
    {
        $customer = User::factory()->create([
            'phone' => $phone,
            'role' => 'CUSTOMER',
            'status' => 'ACTIVE',
        ]);
        $order = Order::create([
            'user_id' => $customer->id,
            'order_number' => 'NOTIFY-'.fake()->unique()->numerify('####'),
            'shipping_address' => '10 Main Street, Colombo',
            'payment_method' => 'COD',
            'payment_status' => 'PENDING',
            'total_amount' => 1500,
            'order_status' => 'PROCESSING',
        ]);

        return [$customer, $order];
    }
}
