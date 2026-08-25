<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('courier_name')->nullable()->after('shipping_address');
            $table->string('tracking_number')->nullable()->unique()->after('courier_name');
            $table->decimal('shipping_fee', 12, 2)->default(0)->after('total_amount');
            $table->timestamp('shipped_at')->nullable()->after('order_status');
            $table->timestamp('delivered_at')->nullable()->after('shipped_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique(['tracking_number']);
            $table->dropColumn(['courier_name', 'tracking_number', 'shipping_fee', 'shipped_at', 'delivered_at']);
        });
    }
};
