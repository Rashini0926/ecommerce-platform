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
            ->assertOk()
            ->assertJsonPath('payment.status', 'PAID')
            ->assertJsonPath('order.payment_status', 'PAID');

        $this->postJson("/api/orders/{$order->id}/payment/complete")
            ->assertOk()
            ->assertJsonPath('message', 'Payment is already complete.')
            ->assertJsonPath('order.id', $order->id);

        $this->assertDatabaseHas('payments', ['order_id' => $order->id, 'status' => 'PAID', 'provider' => 'DEMO']);
        $this->assertDatabaseCount('user_notifications', 1);
        $this->assertSame('PAID', $order->fresh()->payment_status);
    }

    public function test_customer_cannot_complete_payment_after_order_is_cancelled(): void
    {
        $customer = User::create(['full_name' => 'Customer', 'email' => 'cancelled@example.com', 'phone' => '0771234567', 'password' => 'password123', 'role' => 'CUSTOMER']);
        $order = Order::create(['user_id' => $customer->id, 'order_number' => 'PAY-002', 'shipping_address' => '10 Main Street, Colombo', 'payment_method' => 'CARD', 'payment_status' => 'PENDING', 'total_amount' => 1500, 'order_status' => 'PROCESSING']);
        Sanctum::actingAs($customer);

        $this->postJson("/api/orders/{$order->id}/payment/initiate")->assertOk();
        $order->update(['order_status' => 'CANCELLED']);

        $this->postJson("/api/orders/{$order->id}/payment/complete")
            ->assertUnprocessable();

        $this->assertDatabaseHas('payments', ['order_id' => $order->id, 'status' => 'PENDING']);
        $this->assertDatabaseCount('user_notifications', 0);
        $this->assertSame('PENDING', $order->fresh()->payment_status);
    }

    public function test_cash_on_delivery_order_cannot_use_card_gateway(): void
    {
        $customer = User::create(['full_name' => 'Customer', 'email' => 'cod@example.com', 'phone' => '0771234567', 'password' => 'password123', 'role' => 'CUSTOMER']);
        $order = Order::create(['user_id' => $customer->id, 'order_number' => 'PAY-003', 'shipping_address' => '10 Main Street, Colombo', 'payment_method' => 'COD', 'payment_status' => 'PENDING', 'total_amount' => 1500, 'order_status' => 'PROCESSING']);
        Sanctum::actingAs($customer);

        $this->postJson("/api/orders/{$order->id}/payment/initiate")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('order');

        $this->assertDatabaseMissing('payments', ['order_id' => $order->id]);
    }

    public function test_customer_cannot_pay_for_another_customers_order(): void
    {
        $owner = User::create(['full_name' => 'Owner', 'email' => 'owner@example.com', 'phone' => '0771234567', 'password' => 'password123', 'role' => 'CUSTOMER']);
        $otherCustomer = User::create(['full_name' => 'Other', 'email' => 'other@example.com', 'phone' => '0777654321', 'password' => 'password123', 'role' => 'CUSTOMER']);
        $order = Order::create(['user_id' => $owner->id, 'order_number' => 'PAY-004', 'shipping_address' => '10 Main Street, Colombo', 'payment_method' => 'CARD', 'payment_status' => 'PENDING', 'total_amount' => 1500, 'order_status' => 'PROCESSING']);
        Sanctum::actingAs($otherCustomer);

        $this->postJson("/api/orders/{$order->id}/payment/initiate")
            ->assertForbidden();

        $this->assertDatabaseMissing('payments', ['order_id' => $order->id]);
    }
}
