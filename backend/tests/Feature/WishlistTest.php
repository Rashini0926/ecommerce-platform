<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_add_list_and_remove_a_wishlist_product(): void
    {
        [$customer, $product] = $this->catalogueData();
        Sanctum::actingAs($customer);

        $createResponse = $this->postJson('/api/wishlist', ['product_id' => $product->id])
            ->assertCreated()
            ->assertJsonPath('item.product_id', $product->id);

        $wishlistItemId = $createResponse->json('item.id');

        $this->getJson('/api/wishlist')
            ->assertOk()
            ->assertJsonCount(1, 'items')
            ->assertJsonPath('items.0.product.id', $product->id);

        $this->deleteJson("/api/wishlist/{$wishlistItemId}")
            ->assertOk();

        $this->assertDatabaseMissing('wishlist_items', ['id' => $wishlistItemId]);
    }

    public function test_adding_the_same_product_twice_does_not_create_duplicates(): void
    {
        [$customer, $product] = $this->catalogueData();
        Sanctum::actingAs($customer);

        $this->postJson('/api/wishlist', ['product_id' => $product->id])
            ->assertCreated();

        $this->postJson('/api/wishlist', ['product_id' => $product->id])
            ->assertOk()
            ->assertJsonPath('message', 'Product is already in your wishlist.');

        $this->assertDatabaseCount('wishlist_items', 1);
    }

    public function test_customer_cannot_remove_another_customers_wishlist_item(): void
    {
        [$owner, $product] = $this->catalogueData();
        $otherCustomer = User::factory()->create(['role' => 'CUSTOMER', 'status' => 'ACTIVE']);
        $item = WishlistItem::create(['user_id' => $owner->id, 'product_id' => $product->id]);
        Sanctum::actingAs($otherCustomer);

        $this->deleteJson("/api/wishlist/{$item->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('wishlist_items', ['id' => $item->id]);
    }

    public function test_seller_cannot_use_customer_wishlist_endpoints(): void
    {
        [, $product] = $this->catalogueData();
        $seller = User::factory()->create(['role' => 'SELLER', 'status' => 'ACTIVE']);
        Sanctum::actingAs($seller);

        $this->getJson('/api/wishlist')->assertForbidden();
        $this->postJson('/api/wishlist', ['product_id' => $product->id])->assertForbidden();

        $this->assertDatabaseMissing('wishlist_items', ['user_id' => $seller->id]);
    }

    private function catalogueData(): array
    {
        $customer = User::factory()->create(['role' => 'CUSTOMER', 'status' => 'ACTIVE']);
        $category = Category::create(['name' => fake()->unique()->word()]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Wishlist Product',
            'price' => 2500,
            'stock' => 10,
        ]);

        return [$customer, $product];
    }
}
