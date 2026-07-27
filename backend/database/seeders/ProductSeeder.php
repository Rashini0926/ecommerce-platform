<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $electronics = Category::where('name', 'Electronics')->first();
        $mobilePhones = Subcategory::where('name', 'Mobile Phones')->first();
        $laptops = Subcategory::where('name', 'Laptops')->first();

        $fashion = Category::where('name', 'Fashion')->first();
        $men = Subcategory::where('name', 'Men')->first();

        $products = [
            [
                'category_id' => $electronics->id,
                'subcategory_id' => $mobilePhones->id,
                'name' => 'Galaxy S23 Ultra',
                'description' => 'Flagship smartphone with 200MP camera and S Pen support.',
                'price' => 1199.99,
                'brand' => 'Samsung',
                'color' => 'Black',
                'size' => null,
                'rating' => 4.7,
                'image' => 'https://via.placeholder.com/400x400?text=Galaxy+S23',
                'stock' => 25,
            ],
            [
                'category_id' => $electronics->id,
                'subcategory_id' => $mobilePhones->id,
                'name' => 'iPhone 15 Pro',
                'description' => 'Titanium design with A17 Pro chip and Pro camera system.',
                'price' => 1299.00,
                'brand' => 'Apple',
                'color' => 'Titanium Blue',
                'size' => null,
                'rating' => 4.8,
                'image' => 'https://via.placeholder.com/400x400?text=iPhone+15+Pro',
                'stock' => 18,
            ],
            [
                'category_id' => $electronics->id,
                'subcategory_id' => $laptops->id,
                'name' => 'MacBook Air M2',
                'description' => 'Ultra-thin laptop with M2 chip, all-day battery life.',
                'price' => 1099.00,
                'brand' => 'Apple',
                'color' => 'Silver',
                'size' => '13-inch',
                'rating' => 4.9,
                'image' => 'https://via.placeholder.com/400x400?text=MacBook+Air',
                'stock' => 12,
            ],
            [
                'category_id' => $fashion->id,
                'subcategory_id' => $men->id,
                'name' => 'Classic Denim Jacket',
                'description' => 'Timeless denim jacket, comfortable regular fit.',
                'price' => 59.99,
                'brand' => 'Levi\'s',
                'color' => 'Blue',
                'size' => 'M',
                'rating' => 4.3,
                'image' => 'https://via.placeholder.com/400x400?text=Denim+Jacket',
                'stock' => 40,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}