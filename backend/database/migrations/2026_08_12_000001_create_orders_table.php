<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('shipping_address');
            $table->enum('payment_method', ['COD', 'CARD']);
            $table->enum('payment_status', ['PENDING', 'PAID'])->default('PENDING');
            $table->decimal('total_amount', 12, 2);
            $table->enum('order_status', ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])->default('PENDING');
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index('order_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
