<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_products_can_be_filtered_by_subcategory_sale_price_rating_and_search(): void
    {
        $category = Category::create(['name' => 'Electronics']);
        $laptops = Subcategory::create(['category_id' => $category->id, 'name' => 'Laptops']);
        $phones = Subcategory::create(['category_id' => $category->id, 'name' => 'Phones']);
        $matchingProduct = $this->product($category, $laptops, [
            'name' => 'Alpha Work Laptop',
            'description' => 'Portable professional computer',
            'brand' => 'Acme',
            'price' => 1000,
            'discount_percentage' => 20,
            'rating' => 4.8,
        ]);
        $this->product($category, $phones, ['name' => 'Alpha Phone', 'brand' => 'Acme', 'price' => 800, 'rating' => 4.9]);
        $this->product($category, $laptops, ['name' => 'Budget Laptop', 'brand' => 'Other', 'price' => 400, 'rating' => 3]);

        $this->getJson('/api/products?search=Acme&subcategory_id='.$laptops->id.'&min_price=700&max_price=900&min_rating=4')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $matchingProduct->id)
            ->assertJsonPath('data.0.sale_price', 800);
    }

    public function test_products_are_sorted_by_effective_sale_price(): void
    {
        $category = Category::create(['name' => 'Home']);
        $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Appliances']);
        $discounted = $this->product($category, $subcategory, ['name' => 'Discounted Item', 'price' => 1000, 'discount_percentage' => 50]);
        $regular = $this->product($category, $subcategory, ['name' => 'Regular Item', 'price' => 700]);

        $response = $this->getJson('/api/products?sort=price_asc')->assertOk();

        $this->assertSame([$discounted->id, $regular->id], collect($response->json('data'))->pluck('id')->all());
    }

    public function test_product_results_are_paginated(): void
    {
        $category = Category::create(['name' => 'Fashion']);
        $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Clothing']);

        foreach (range(1, 13) as $number) {
            $this->product($category, $subcategory, ['name' => "Product {$number}"]);
        }

        $this->getJson('/api/products?sort=name&per_page=5&page=2')
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.last_page', 3)
            ->assertJsonPath('meta.total', 13);
    }

    private function product(Category $category, Subcategory $subcategory, array $attributes): Product
    {
        return Product::create(array_merge([
            'category_id' => $category->id,
            'subcategory_id' => $subcategory->id,
            'name' => fake()->unique()->words(3, true),
            'price' => 1000,
            'discount_percentage' => 0,
            'rating' => 4,
            'stock' => 10,
        ], $attributes));
    }
}
