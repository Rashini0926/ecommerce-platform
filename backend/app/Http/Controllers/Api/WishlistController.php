<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = WishlistItem::with(['product.category', 'product.subcategory'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'items' => $items,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $item = WishlistItem::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
        ]);

        $item->load(['product.category', 'product.subcategory']);

        return response()->json([
            'success' => true,
            'message' => 'Product added to wishlist.',
            'item' => $item,
        ], 201);
    }

    public function destroy(Request $request, WishlistItem $wishlistItem): JsonResponse
    {
        if ($wishlistItem->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to remove this wishlist item.');
        }

        $wishlistItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product removed from wishlist.',
        ]);
    }
}
