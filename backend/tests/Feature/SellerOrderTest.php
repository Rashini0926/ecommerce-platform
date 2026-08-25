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

class SellerOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_seller_can_view_and_update_only_their_order_items(): void
    {
        $seller = $this->user('SELLER');
        $customer = $this->user('CUSTOMER');
        $product = Product::create(['user_id' => $seller->id, 'category_id' => Category::create(['name' => 'Electronics'])->id, 'name' => 'Headphones', 'price' => 1000, 'stock' => 5]);
        $order = Order::create(['user_id' => $customer->id, 'order_number' => 'SELLER-001', 'shipping_address' => '10 Main Street, Colombo', 'payment_method' => 'COD', 'payment_status' => 'PENDING', 'total_amount' => 1000, 'order_status' => 'PROCESSING']);
        $item = OrderItem::create(['order_id' => $order->id, 'product_id' => $product->id, 'product_name' => $product->name, 'unit_price' => 1000, 'quantity' => 1, 'subtotal' => 1000]);

        Sanctum::actingAs($seller);
        $this->getJson('/api/seller/order-items')->assertOk()->assertJsonCount(1, 'order_items');
        $this->patchJson("/api/seller/order-items/{$item->id}/fulfillment", ['fulfillment_status' => 'READY_TO_SHIP'])
            ->assertOk()->assertJsonPath('order_item.fulfillment_status', 'READY_TO_SHIP');
    }

    private function user(string $role): User
    {
        return User::create(['full_name' => "{$role} User", 'email' => fake()->unique()->safeEmail(), 'phone' => '0771234567', 'password' => 'password123', 'role' => $role]);
    }
}
