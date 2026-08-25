<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_place_a_cash_on_delivery_order(): void
    {
        [$customer, $product] = $this->createCheckoutData();

        Sanctum::actingAs($customer);

        $response = $this->postJson('/api/orders', [
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'COD',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('order.payment_status', 'PENDING')
            ->assertJsonPath('order.order_status', 'PROCESSING');

        $this->assertDatabaseHas('orders', [
            'user_id' => $customer->id,
            'payment_method' => 'COD',
            'total_amount' => 7500,
        ]);
        $this->assertDatabaseCount('cart_items', 0);
        $this->assertSame(7, $product->fresh()->stock);
    }

    public function test_card_checkout_starts_with_a_pending_payment(): void
    {
        [$customer] = $this->createCheckoutData();

        Sanctum::actingAs($customer);

        $this->postJson('/api/orders', [
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'CARD',
        ])->assertCreated()->assertJsonPath('order.payment_status', 'PENDING');
    }

    private function createCheckoutData(): array
    {
        $customer = User::create([
            'full_name' => 'Kasun Perera',
            'email' => fake()->unique()->safeEmail(),
            'phone' => '0771234567',
            'password' => 'password123',
            'role' => 'CUSTOMER',
        ]);
        $category = Category::create(['name' => fake()->unique()->word()]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Demo Headphones',
            'price' => 2500,
            'stock' => 10,
        ]);
        CartItem::create([
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        return [$customer, $product];
    }
}
