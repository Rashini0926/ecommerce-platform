<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $demoUsers = [
            ['full_name' => 'Demo Customer', 'email' => 'customer@shopease.com', 'role' => 'CUSTOMER'],
            ['full_name' => 'Demo Seller', 'email' => 'seller@shopease.com', 'role' => 'SELLER'],
            ['full_name' => 'Demo Admin', 'email' => 'admin@shopease.com', 'role' => 'ADMIN'],
        ];

        foreach ($demoUsers as $user) {
            User::updateOrCreate(['email' => $user['email']], [
                ...$user,
                'phone' => '0771234567',
                'password' => 'password123',
            ]);
        }

        $this->call(ProductSeeder::class);

    }
}
