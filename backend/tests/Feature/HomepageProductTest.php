<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomepageProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_returns_real_featured_deal_and_best_seller_products(): void
    {
        $category = Category::create(['name' => 'Electronics']);
        $discountedProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Discounted Headphones',
            'price' => 1000,
            'discount_percentage' => 20,
            'rating' => 4.5,
            'stock' => 10,
        ]);
        $topRatedProduct = Product::create([
            'category_id' => $category->id,
            'name' => 'Top Rated Speaker',
            'price' => 2000,
            'rating' => 4.9,
            'stock' => 5,
        ]);
        $customer = User::factory()->create(['role' => 'CUSTOMER', 'status' => 'ACTIVE']);
        $order = Order::create([
            'user_id' => $customer->id,
            'order_number' => 'HOME-001',
            'shipping_address' => '10 Main Street, Colombo',
            'payment_method' => 'COD',
            'payment_status' => 'PENDING',
            'total_amount' => 4000,
            'order_status' => 'PROCESSING',
        ]);
        $order->items()->create([
            'product_id' => $discountedProduct->id,
            'product_name' => $discountedProduct->name,
            'unit_price' => 800,
            'quantity' => 5,
            'subtotal' => 4000,
        ]);

        $this->getJson('/api/homepage/products')
            ->assertOk()
            ->assertJsonPath('featured_products.0.id', $topRatedProduct->id)
            ->assertJsonPath('flash_deals.0.id', $discountedProduct->id)
            ->assertJsonPath('flash_deals.0.sale_price', 800)
            ->assertJsonPath('best_sellers.0.id', $discountedProduct->id)
            ->assertJsonPath('best_sellers.0.units_sold', 5);
    }
}
