<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = CartItem::with(['product.category', 'product.subcategory'])
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
            'quantity' => 'nullable|integer|min:1|max:99',
        ]);

        $quantity = $validated['quantity'] ?? 1;

        $item = CartItem::firstOrNew([
            'user_id' => $request->user()->id,
            'product_id' => $validated['product_id'],
        ]);

        $item->quantity = $item->exists ? $item->quantity + $quantity : $quantity;
        $item->save();
        $item->load(['product.category', 'product.subcategory']);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart.',
            'item' => $item,
        ], 201);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to update this cart item.');
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);

        $cartItem->load(['product.category', 'product.subcategory']);

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated.',
            'item' => $cartItem,
        ]);
    }

    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to remove this cart item.');
        }

        $cartItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart item removed.',
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared.',
        ]);
    }
}
