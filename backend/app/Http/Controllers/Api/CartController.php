<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureCustomer($request);

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
        $this->ensureCustomer($request);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1|max:99',
        ]);

        $quantity = $validated['quantity'] ?? 1;

        $item = DB::transaction(function () use ($request, $validated, $quantity) {
            $product = Product::visibleToCustomers()->lockForUpdate()->findOrFail($validated['product_id']);
            $item = CartItem::where('user_id', $request->user()->id)
                ->where('product_id', $product->id)
                ->lockForUpdate()
                ->first();
            $requestedQuantity = ($item?->quantity ?? 0) + $quantity;

            $this->ensureStockIsAvailable($product, $requestedQuantity);

            $item ??= new CartItem([
                'user_id' => $request->user()->id,
                'product_id' => $product->id,
            ]);
            $item->quantity = $requestedQuantity;
            $item->save();

            return $item;
        });

        $item->load(['product.category', 'product.subcategory']);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart.',
            'item' => $item,
        ], 201);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->ensureCustomer($request);

        if ($cartItem->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to update this cart item.');
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        DB::transaction(function () use ($cartItem, $validated) {
            $product = Product::lockForUpdate()->find($cartItem->product_id);

            if (! $product) {
                throw ValidationException::withMessages(['product' => 'This product is no longer available.']);
            }

            $this->ensureStockIsAvailable($product, $validated['quantity']);
            $cartItem->update(['quantity' => $validated['quantity']]);
        });

        $cartItem->load(['product.category', 'product.subcategory']);

        return response()->json([
            'success' => true,
            'message' => 'Cart item updated.',
            'item' => $cartItem,
        ]);
    }

    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->ensureCustomer($request);

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
        $this->ensureCustomer($request);

        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared.',
        ]);
    }

    private function ensureStockIsAvailable(Product $product, int $quantity): void
    {
        if ($quantity > 99) {
            throw ValidationException::withMessages(['quantity' => 'Cart quantity cannot exceed 99 units.']);
        }

        if ($product->stock < $quantity) {
            throw ValidationException::withMessages([
                'quantity' => "Only {$product->stock} units of {$product->name} are available.",
            ]);
        }
    }

    private function ensureCustomer(Request $request): void
    {
        abort_unless($request->user()->role === 'CUSTOMER', 403, 'Only customer accounts can use the shopping cart.');
    }
}
