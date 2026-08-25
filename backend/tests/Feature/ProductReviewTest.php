<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_review_a_delivered_purchase(): void
    {
        [$customer, $product] = $this->deliveredPurchase();
        Sanctum::actingAs($customer);

        $this->postJson("/api/products/{$product->id}/reviews", [
            'rating' => 5,
            'comment' => 'Excellent product.',
        ])->assertCreated()->assertJsonPath('review.rating', 5);

        $this->assertDatabaseHas('product_reviews', ['product_id' => $product->id, 'user_id' => $customer->id]);
        $this->assertSame(5.0, (float) $product->fresh()->rating);
    }

    public function test_customer_cannot_review_an_undelivered_product(): void
    {
        $customer = $this->customer();
        $product = Product::create(['category_id' => Category::create(['name' => 'Test'])->id, 'name' => 'Product', 'price' => 100, 'stock' => 1]);
        Sanctum::actingAs($customer);

        $this->postJson("/api/products/{$product->id}/reviews", ['rating' => 4])
            ->assertUnprocessable()->assertJsonValidationErrors('product');
    }

    private function deliveredPurchase(): array
    {
        $customer = $this->customer();
        $product = Product::create(['category_id' => Category::create(['name' => 'Electronics'])->id, 'name' => 'Headphones', 'price' => 100, 'stock' => 4]);
        $order = Order::create(['user_id' => $customer->id, 'order_number' => 'TEST-001', 'shipping_address' => '10 Main Street, Colombo', 'payment_method' => 'COD', 'payment_status' => 'PENDING', 'total_amount' => 100, 'order_status' => 'DELIVERED']);
        OrderItem::create(['order_id' => $order->id, 'product_id' => $product->id, 'product_name' => $product->name, 'unit_price' => 100, 'quantity' => 1, 'subtotal' => 100]);

        return [$customer, $product];
    }

    private function customer(): User
    {
        return User::create([
            'full_name' => 'Review Customer',
            'email' => fake()->unique()->safeEmail(),
            'phone' => '0771234567',
            'password' => 'password123',
            'role' => 'CUSTOMER',
        ]);
    }
}
