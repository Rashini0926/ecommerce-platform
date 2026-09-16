<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\UserNotification;
use App\Models\WishlistItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlatformHardeningTest extends TestCase
{
    use RefreshDatabase;

    public function test_pending_seller_registration_does_not_issue_an_access_token(): void
    {
        $this->postJson('/api/register', [
            'full_name' => 'Pending Seller',
            'email' => 'pending@example.com',
            'phone' => '0771234567',
            'role' => 'seller',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ])->assertCreated()
            ->assertJsonPath('requires_approval', true)
            ->assertJsonPath('token', null)
            ->assertJsonPath('user.status', 'PENDING');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_inactive_accounts_cannot_use_an_existing_token(): void
    {
        $pendingSeller = $this->user('SELLER', 'PENDING');
        Sanctum::actingAs($pendingSeller);

        $this->getJson('/api/profile')
            ->assertForbidden()
            ->assertJsonPath('message', 'Your account is awaiting administrator approval.');
    }

    public function test_only_admin_can_manage_categories_and_used_categories_cannot_be_deleted(): void
    {
        $seller = $this->user('SELLER');
        Sanctum::actingAs($seller);
        $this->postJson('/api/categories', ['name' => 'Unauthorized'])->assertForbidden();

        $admin = $this->user('ADMIN');
        $category = Category::create(['name' => 'Electronics']);
        Product::create([
            'user_id' => $seller->id,
            'category_id' => $category->id,
            'name' => 'Laptop',
            'price' => 250000,
            'stock' => 5,
        ]);

        Sanctum::actingAs($admin);
        $this->deleteJson("/api/categories/{$category->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category');

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
        $this->assertDatabaseHas('products', ['name' => 'Laptop']);
    }

    public function test_seller_keeps_historical_order_ownership_after_product_deletion(): void
    {
        $seller = $this->user('SELLER');
        $customer = $this->user('CUSTOMER');
        $product = $this->product($seller);
        $order = $this->order($customer, 'HISTORY-001', 'PAID');
        $item = $this->item($order, $product);

        $this->assertSame($seller->id, $item->seller_id);
        $product->delete();

        Sanctum::actingAs($seller);
        $this->getJson('/api/seller/order-items')
            ->assertOk()
            ->assertJsonCount(1, 'order_items')
            ->assertJsonPath('order_items.0.product_name', 'Test Product');

        $this->getJson('/api/seller/reports/summary?from='.now()->subDay()->toDateString().'&to='.now()->toDateString())
            ->assertOk()
            ->assertJsonPath('summary.paid_revenue', 1000);
    }

    public function test_fulfillment_requires_payment_and_admin_dispatch_confirms_shipment(): void
    {
        $seller = $this->user('SELLER');
        $customer = $this->user('CUSTOMER');
        $admin = $this->user('ADMIN');
        $product = $this->product($seller);
        $order = $this->order($customer, 'FULFILL-001', 'PENDING');
        $item = $this->item($order, $product);

        Sanctum::actingAs($seller);
        $this->patchJson("/api/seller/order-items/{$item->id}/fulfillment", [
            'fulfillment_status' => 'READY_TO_SHIP',
        ])->assertUnprocessable();

        $order->update(['payment_status' => 'PAID']);
        $this->patchJson("/api/seller/order-items/{$item->id}/fulfillment", [
            'fulfillment_status' => 'READY_TO_SHIP',
        ])->assertOk()->assertJsonPath('order_item.fulfillment_status', 'READY_TO_SHIP');

        $this->patchJson("/api/seller/order-items/{$item->id}/fulfillment", [
            'fulfillment_status' => 'SHIPPED',
        ])->assertUnprocessable();

        Sanctum::actingAs($admin);
        $this->patchJson("/api/admin/orders/{$order->id}/shipping", [
            'courier_name' => 'Domex',
            'tracking_number' => 'DOM-FINAL-001',
            'shipping_fee' => 350,
        ])->assertOk()->assertJsonPath('order.order_status', 'SHIPPED');

        $this->assertSame('SHIPPED', $item->fresh()->fulfillment_status);
    }

    public function test_admin_orders_are_filterable_and_paginated(): void
    {
        $admin = $this->user('ADMIN');
        $customer = $this->user('CUSTOMER');
        $this->order($customer, 'FILTER-PAID', 'PAID');
        $this->order($customer, 'FILTER-PENDING', 'PENDING');

        Sanctum::actingAs($admin);
        $this->getJson('/api/admin/orders?search=FILTER&payment_status=PAID&per_page=1')
            ->assertOk()
            ->assertJsonCount(1, 'orders')
            ->assertJsonPath('orders.0.order_number', 'FILTER-PAID')
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('meta.per_page', 1);
    }

    public function test_account_summary_returns_real_customer_badge_counts(): void
    {
        $customer = $this->user('CUSTOMER');
        $seller = $this->user('SELLER');
        $product = $this->product($seller);
        CartItem::create(['user_id' => $customer->id, 'product_id' => $product->id, 'quantity' => 3]);
        WishlistItem::create(['user_id' => $customer->id, 'product_id' => $product->id]);
        UserNotification::create([
            'user_id' => $customer->id,
            'type' => 'ORDER',
            'title' => 'Order update',
            'message' => 'Your order is processing.',
        ]);

        Sanctum::actingAs($customer);
        $this->getJson('/api/account/summary')
            ->assertOk()
            ->assertJsonPath('counts.cart_items', 3)
            ->assertJsonPath('counts.wishlist_items', 1)
            ->assertJsonPath('counts.unread_notifications', 1);
    }

    public function test_suspended_seller_products_are_hidden_and_cannot_be_added_to_cart(): void
    {
        $seller = $this->user('SELLER', 'SUSPENDED');
        $product = $this->product($seller);

        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('meta.total', 0);
        $this->getJson("/api/products/{$product->id}")->assertNotFound();

        Sanctum::actingAs($this->user('CUSTOMER'));
        $this->postJson('/api/cart', ['product_id' => $product->id, 'quantity' => 1])
            ->assertNotFound();
    }

    public function test_customer_dashboard_uses_real_account_and_order_data(): void
    {
        $customer = $this->user('CUSTOMER');
        $seller = $this->user('SELLER');
        $product = $this->product($seller);
        $order = $this->order($customer, 'DASHBOARD-001', 'PAID');
        $this->item($order, $product);
        CartItem::create(['user_id' => $customer->id, 'product_id' => $product->id, 'quantity' => 2]);
        WishlistItem::create(['user_id' => $customer->id, 'product_id' => $product->id]);

        Sanctum::actingAs($customer);
        $this->getJson('/api/customer/dashboard')
            ->assertOk()
            ->assertJsonPath('summary.total_orders', 1)
            ->assertJsonPath('summary.cart_items', 2)
            ->assertJsonPath('summary.wishlist_items', 1)
            ->assertJsonPath('latest_order.order_number', 'DASHBOARD-001')
            ->assertJsonCount(1, 'recent_orders');

        Sanctum::actingAs($seller);
        $this->getJson('/api/customer/dashboard')->assertForbidden();
    }

    private function user(string $role, string $status = 'ACTIVE'): User
    {
        return User::factory()->create(['role' => $role, 'status' => $status]);
    }

    private function product(User $seller): Product
    {
        return Product::create([
            'user_id' => $seller->id,
            'category_id' => Category::firstOrCreate(['name' => 'General'])->id,
            'name' => 'Test Product',
            'price' => 1000,
            'stock' => 10,
        ]);
    }

    private function order(User $customer, string $number, string $paymentStatus): Order
    {
        return Order::create([
            'user_id' => $customer->id,
            'order_number' => $number,
            'shipping_address' => '10 Main Street, Colombo',
            'payment_method' => 'CARD',
            'payment_status' => $paymentStatus,
            'total_amount' => 1000,
            'order_status' => 'PROCESSING',
        ]);
    }

    private function item(Order $order, Product $product): OrderItem
    {
        return OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit_price' => 1000,
            'quantity' => 1,
            'subtotal' => 1000,
        ]);
    }
}
