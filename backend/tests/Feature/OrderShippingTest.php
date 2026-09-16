<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderShippingTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_add_shipping_details_and_customer_can_track_order(): void
    {
        $customer = $this->user('CUSTOMER');
        $admin = $this->user('ADMIN');
        $order = $this->order($customer);

        Sanctum::actingAs($admin);
        $this->patchJson("/api/admin/orders/{$order->id}/shipping", [
            'courier_name' => 'Domex',
            'tracking_number' => 'DOM-123456',
            'shipping_fee' => 450,
        ])->assertOk()->assertJsonPath('order.order_status', 'SHIPPED');

        Sanctum::actingAs($customer);
        $this->getJson("/api/orders/{$order->id}/tracking")
            ->assertOk()
            ->assertJsonPath('tracking.courier_name', 'Domex')
            ->assertJsonPath('tracking.tracking_number', 'DOM-123456');
    }

    public function test_customer_cannot_track_someone_elses_order(): void
    {
        $order = $this->order($this->user('CUSTOMER'));
        Sanctum::actingAs($this->user('CUSTOMER'));

        $this->getJson("/api/orders/{$order->id}/tracking")->assertForbidden();
    }

    public function test_processing_order_cannot_skip_directly_to_delivered(): void
    {
        $order = $this->order($this->user('CUSTOMER'));
        Sanctum::actingAs($this->user('ADMIN'));

        $this->patchJson("/api/admin/orders/{$order->id}/status", [
            'order_status' => 'DELIVERED',
        ])->assertUnprocessable();

        $this->assertSame('PROCESSING', $order->fresh()->order_status);
    }

    public function test_status_endpoint_cannot_ship_without_tracking_details(): void
    {
        $order = $this->order($this->user('CUSTOMER'));
        Sanctum::actingAs($this->user('ADMIN'));

        $this->patchJson("/api/admin/orders/{$order->id}/status", [
            'order_status' => 'SHIPPED',
        ])->assertUnprocessable();
    }

    public function test_shipped_order_can_be_delivered_but_cannot_move_back(): void
    {
        $order = $this->order($this->user('CUSTOMER'));
        Sanctum::actingAs($this->user('ADMIN'));

        $this->patchJson("/api/admin/orders/{$order->id}/shipping", [
            'courier_name' => 'Domex',
            'tracking_number' => 'DOM-654321',
            'shipping_fee' => 450,
        ])->assertOk();

        $this->patchJson("/api/admin/orders/{$order->id}/status", [
            'order_status' => 'DELIVERED',
        ])->assertOk()->assertJsonPath('order.order_status', 'DELIVERED');

        $this->patchJson("/api/admin/orders/{$order->id}/status", [
            'order_status' => 'PROCESSING',
        ])->assertUnprocessable();
    }

    public function test_unpaid_card_order_cannot_be_dispatched(): void
    {
        $order = $this->order($this->user('CUSTOMER'));
        $order->update(['payment_method' => 'CARD']);
        Sanctum::actingAs($this->user('ADMIN'));

        $this->patchJson("/api/admin/orders/{$order->id}/shipping", [
            'courier_name' => 'Domex',
            'tracking_number' => 'DOM-UNPAID',
        ])->assertUnprocessable();
    }

    public function test_paid_order_cannot_be_cancelled_without_a_refund(): void
    {
        $customer = $this->user('CUSTOMER');
        $order = $this->order($customer);
        $order->update(['payment_method' => 'CARD', 'payment_status' => 'PAID']);
        Sanctum::actingAs($customer);

        $this->patchJson("/api/orders/{$order->id}/cancel")
            ->assertUnprocessable();

        $this->assertSame('PROCESSING', $order->fresh()->order_status);
    }

    private function user(string $role): User
    {
        return User::create([
            'full_name' => "{$role} User",
            'email' => fake()->unique()->safeEmail(),
            'phone' => '0771234567',
            'password' => 'password123',
            'role' => $role,
        ]);
    }

    private function order(User $customer): Order
    {
        return Order::create([
            'user_id' => $customer->id,
            'order_number' => 'SHIP-'.fake()->unique()->numerify('######'),
            'shipping_address' => '10 Main Street, Colombo',
            'payment_method' => 'COD',
            'payment_status' => 'PENDING',
            'total_amount' => 1000,
            'order_status' => 'PROCESSING',
        ]);
    }
}
