<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'icon' => '💻',
                'subcategories' => ['Mobile Phones', 'Laptops', 'TVs', 'Cameras', 'Headphones'],
            ],
            [
                'name' => 'Fashion',
                'icon' => '👕',
                'subcategories' => ['Men', 'Women', 'Kids', 'Shoes'],
            ],
            [
                'name' => 'Home & Living',
                'icon' => '🏠',
                'subcategories' => ['Furniture', 'Kitchen', 'Decor'],
            ],
            [
                'name' => 'Beauty',
                'icon' => '💄',
                'subcategories' => ['Skincare', 'Makeup', 'Haircare'],
            ],
            [
                'name' => 'Sports',
                'icon' => '⚽',
                'subcategories' => ['Fitness', 'Outdoor', 'Cycling'],
            ],
            [
                'name' => 'Groceries',
                'icon' => '🛒',
                'subcategories' => ['Fresh Produce', 'Snacks', 'Beverages'],
            ],
        ];

        foreach ($categories as $categoryData) {
            $category = Category::create([
                'name' => $categoryData['name'],
                'icon' => $categoryData['icon'],
            ]);

            foreach ($categoryData['subcategories'] as $subName) {
                $category->subcategories()->create(['name' => $subName]);
            }
        }
    }
}