<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\WishlistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureCustomer($request);

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
        $this->ensureCustomer($request);

        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);
        Product::visibleToCustomers()->findOrFail($validated['product_id']);

        $item = WishlistItem::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
        ]);

        $item->load(['product.category', 'product.subcategory']);

        return response()->json([
            'success' => true,
            'message' => $item->wasRecentlyCreated
                ? 'Product added to wishlist.'
                : 'Product is already in your wishlist.',
            'item' => $item,
        ], $item->wasRecentlyCreated ? 201 : 200);
    }

    public function destroy(Request $request, WishlistItem $wishlistItem): JsonResponse
    {
        $this->ensureCustomer($request);

        if ($wishlistItem->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to remove this wishlist item.');
        }

        $wishlistItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product removed from wishlist.',
        ]);
    }

    private function ensureCustomer(Request $request): void
    {
        abort_unless($request->user()->role === 'CUSTOMER', 403, 'Only customer accounts can use the wishlist.');
    }
}
