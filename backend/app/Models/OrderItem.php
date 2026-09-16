<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'seller_id',
        'product_name',
        'unit_price',
        'quantity',
        'subtotal',
        'fulfillment_status',
    ];

    protected static function booted(): void
    {
        static::creating(function (OrderItem $item): void {
            if (! $item->seller_id && $item->product_id) {
                $item->seller_id = Product::whereKey($item->product_id)->value('user_id');
            }
        });
    }

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
