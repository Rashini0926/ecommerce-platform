<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
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
            'checkout_token' => (string) Str::uuid(),
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'COD',
            'total_amount' => 1,
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
            'checkout_token' => (string) Str::uuid(),
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'CARD',
        ])->assertCreated()->assertJsonPath('order.payment_status', 'PENDING');
    }

    public function test_checkout_uses_the_discounted_product_price(): void
    {
        [$customer, $product] = $this->createCheckoutData();
        $product->update(['discount_percentage' => 20]);
        Sanctum::actingAs($customer);

        $this->postJson('/api/orders', [
            'checkout_token' => (string) Str::uuid(),
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'COD',
        ])->assertCreated();

        $this->assertDatabaseHas('orders', ['user_id' => $customer->id, 'total_amount' => 6000]);
        $this->assertDatabaseHas('order_items', ['product_id' => $product->id, 'unit_price' => 2000, 'subtotal' => 6000]);
    }

    public function test_retrying_the_same_checkout_returns_the_original_order(): void
    {
        [$customer, $product] = $this->createCheckoutData();
        $checkoutToken = (string) Str::uuid();
        Sanctum::actingAs($customer);

        $payload = [
            'checkout_token' => $checkoutToken,
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'COD',
        ];

        $firstOrderId = $this->postJson('/api/orders', $payload)
            ->assertCreated()
            ->json('order.id');

        $this->postJson('/api/orders', $payload)
            ->assertOk()
            ->assertJsonPath('message', 'This checkout was already completed.')
            ->assertJsonPath('order.id', $firstOrderId);

        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseCount('user_notifications', 1);
        $this->assertSame(7, $product->fresh()->stock);
    }

    public function test_checkout_rolls_back_when_stock_changed_after_cart_was_loaded(): void
    {
        [$customer, $product] = $this->createCheckoutData();
        $product->update(['stock' => 2]);
        Sanctum::actingAs($customer);

        $this->postJson('/api/orders', [
            'checkout_token' => (string) Str::uuid(),
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'COD',
        ])->assertUnprocessable()->assertJsonValidationErrors('cart');

        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseHas('cart_items', [
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);
        $this->assertSame(2, $product->fresh()->stock);
    }

    public function test_checkout_requires_a_valid_idempotency_token(): void
    {
        [$customer] = $this->createCheckoutData();
        Sanctum::actingAs($customer);

        $this->postJson('/api/orders', [
            'checkout_token' => 'invalid-token',
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'COD',
        ])->assertUnprocessable()->assertJsonValidationErrors('checkout_token');

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_checkout_tokens_are_scoped_to_each_customer(): void
    {
        [$firstCustomer] = $this->createCheckoutData();
        [$secondCustomer] = $this->createCheckoutData();
        $checkoutToken = (string) Str::uuid();
        $payload = [
            'checkout_token' => $checkoutToken,
            'shipping_address' => 'Kasun Perera, 0771234567, 10 Main Street, Colombo',
            'payment_method' => 'COD',
        ];

        Sanctum::actingAs($firstCustomer);
        $this->postJson('/api/orders', $payload)->assertCreated();

        Sanctum::actingAs($secondCustomer);
        $this->postJson('/api/orders', $payload)->assertCreated();

        $this->assertDatabaseCount('orders', 2);
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
