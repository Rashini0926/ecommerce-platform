<?php

namespace Tests\Feature;

use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CartStockTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_add_more_items_than_available_stock(): void
    {
        [$customer, $product] = $this->catalogueData(stock: 3);
        Sanctum::actingAs($customer);

        $this->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 4,
        ])->assertUnprocessable()->assertJsonValidationErrors('quantity');

        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_repeated_additions_cannot_exceed_available_stock(): void
    {
        [$customer, $product] = $this->catalogueData(stock: 5);
        Sanctum::actingAs($customer);

        $this->postJson('/api/cart', ['product_id' => $product->id, 'quantity' => 3])->assertCreated();
        $this->postJson('/api/cart', ['product_id' => $product->id, 'quantity' => 3])
            ->assertUnprocessable()->assertJsonValidationErrors('quantity');

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $customer->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);
    }

    public function test_customer_cannot_update_cart_quantity_beyond_stock(): void
    {
        [$customer, $product] = $this->catalogueData(stock: 2);
        $item = CartItem::create(['user_id' => $customer->id, 'product_id' => $product->id, 'quantity' => 1]);
        Sanctum::actingAs($customer);

        $this->patchJson("/api/cart/{$item->id}", ['quantity' => 3])
            ->assertUnprocessable()->assertJsonValidationErrors('quantity');

        $this->assertSame(1, $item->fresh()->quantity);
    }

    public function test_seller_cannot_use_customer_cart_endpoints(): void
    {
        [$customer, $product] = $this->catalogueData();
        $seller = User::factory()->create(['role' => 'SELLER', 'status' => 'ACTIVE']);
        Sanctum::actingAs($seller);

        $this->postJson('/api/cart', ['product_id' => $product->id, 'quantity' => 1])
            ->assertForbidden();

        $this->assertDatabaseMissing('cart_items', ['user_id' => $seller->id]);
    }

    private function catalogueData(int $stock = 10): array
    {
        $customer = User::factory()->create(['role' => 'CUSTOMER', 'status' => 'ACTIVE']);
        $category = Category::create(['name' => fake()->unique()->word()]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Stock Controlled Product',
            'price' => 2500,
            'stock' => $stock,
        ]);

        return [$customer, $product];
    }
}
