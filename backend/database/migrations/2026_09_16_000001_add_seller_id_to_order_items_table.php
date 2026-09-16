<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('seller_id')
                ->nullable()
                ->after('product_id')
                ->constrained('users')
                ->nullOnDelete();
        });

        DB::table('order_items')
            ->whereNull('seller_id')
            ->whereNotNull('product_id')
            ->orderBy('id')
            ->chunkById(200, function ($items): void {
                $sellerIds = DB::table('products')
                    ->whereIn('id', $items->pluck('product_id')->filter()->unique())
                    ->pluck('user_id', 'id');

                foreach ($items as $item) {
                    $sellerId = $sellerIds[$item->product_id] ?? null;

                    if ($sellerId) {
                        DB::table('order_items')->where('id', $item->id)->update(['seller_id' => $sellerId]);
                    }
                }
            });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('seller_id');
        });
    }
};
