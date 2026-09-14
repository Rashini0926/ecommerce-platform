<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'subcategory_id',
        'user_id',
        'name',
        'description',
        'price',
        'discount_percentage',
        'brand',
        'color',
        'size',
        'rating',
        'image',
        'stock',
    ];

    protected $appends = [
        'sale_price',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount_percentage' => 'decimal:2',
            'rating' => 'decimal:1',
            'stock' => 'integer',
        ];
    }

    public function getSalePriceAttribute(): float
    {
        $discountMultiplier = 1 - ((float) $this->discount_percentage / 100);

        return round((float) $this->price * $discountMultiplier, 2);
    }

    public function category()
    {
        return $this->belongsTo(
            Category::class
        );
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(
            Subcategory::class
        );
    }

    public function wishlistItems()
    {
        return $this->hasMany(WishlistItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}
