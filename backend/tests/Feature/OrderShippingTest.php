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
            'order_number' => 'SHIP-' . fake()->unique()->numerify('######'),
            'shipping_address' => '10 Main Street, Colombo',
            'payment_method' => 'COD',
            'payment_status' => 'PENDING',
            'total_amount' => 1000,
            'order_status' => 'PROCESSING',
        ]);
    }
}
