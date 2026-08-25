<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DemoPaymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_complete_a_demo_card_payment(): void
    {
        $customer = User::create(['full_name' => 'Customer', 'email' => 'customer@example.com', 'phone' => '0771234567', 'password' => 'password123', 'role' => 'CUSTOMER']);
        $order = Order::create(['user_id' => $customer->id, 'order_number' => 'PAY-001', 'shipping_address' => '10 Main Street, Colombo', 'payment_method' => 'CARD', 'payment_status' => 'PENDING', 'total_amount' => 1500, 'order_status' => 'PROCESSING']);
        Sanctum::actingAs($customer);

        $this->postJson("/api/orders/{$order->id}/payment/initiate")
            ->assertOk()->assertJsonPath('payment.status', 'PENDING');

        $this->postJson("/api/orders/{$order->id}/payment/complete")
            ->assertOk()->assertJsonPath('payment.status', 'PAID');

        $this->assertDatabaseHas('payments', ['order_id' => $order->id, 'status' => 'PAID', 'provider' => 'DEMO']);
        $this->assertSame('PAID', $order->fresh()->payment_status);
    }
}
