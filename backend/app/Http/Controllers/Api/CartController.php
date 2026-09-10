<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET LOGGED-IN USER CART
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): JsonResponse
    {
        $items = CartItem::with([
            'product.category',
            'product.subcategory'
        ])
            ->where(
                'user_id',
                $request->user()->id
            )
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'items' => $items,
            'total_items' => $items->sum('quantity'),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADD PRODUCT TO CART
    |--------------------------------------------------------------------------
    */

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'quantity' => [
                'nullable',
                'integer',
                'min:1',
                'max:99',
            ],
        ]);

        $quantity =
            $validated['quantity'] ?? 1;

        /*
        |--------------------------------------------------------------------------
        | Find Product
        |--------------------------------------------------------------------------
        */

        $product = Product::findOrFail(
            $validated['product_id']
        );


        /*
        |--------------------------------------------------------------------------
        | Check Stock
        |--------------------------------------------------------------------------
        */

        if ($product->stock <= 0) {
            return response()->json([
                'success' => false,
                'message' =>
                    'This product is currently out of stock.',
            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | Find Existing Cart Item
        |--------------------------------------------------------------------------
        */

        $item = CartItem::where(
            'user_id',
            $request->user()->id
        )
            ->where(
                'product_id',
                $product->id
            )
            ->first();


        /*
        |--------------------------------------------------------------------------
        | Calculate New Quantity
        |--------------------------------------------------------------------------
        */

        $newQuantity = $item
            ? $item->quantity + $quantity
            : $quantity;


        /*
        |--------------------------------------------------------------------------
        | Prevent Quantity > Stock
        |--------------------------------------------------------------------------
        */

        if (
            $newQuantity >
            $product->stock
        ) {
            return response()->json([
                'success' => false,

                'message' =>
                    "Only {$product->stock} item(s) are available in stock.",

            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | Create / Update Cart Item
        |--------------------------------------------------------------------------
        */

        if ($item) {

            $item->quantity =
                $newQuantity;

            $item->save();

        } else {

            $item = CartItem::create([
                'user_id' =>
                    $request->user()->id,

                'product_id' =>
                    $product->id,

                'quantity' =>
                    $quantity,
            ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Load Product Relations
        |--------------------------------------------------------------------------
        */

        $item->load([
            'product.category',
            'product.subcategory'
        ]);


        return response()->json([
            'success' => true,

            'message' =>
                'Product added to cart successfully.',

            'item' =>
                $item,

        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE CART QUANTITY
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        CartItem $cartItem
    ): JsonResponse {

        /*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        */

        if (
            $cartItem->user_id !==
            $request->user()->id
        ) {
            return response()->json([
                'success' => false,

                'message' =>
                    'You are not allowed to update this cart item.',

            ], 403);
        }


        /*
        |--------------------------------------------------------------------------
        | Validate Quantity
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'quantity' => [
                'required',
                'integer',
                'min:1',
                'max:99',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Load Product
        |--------------------------------------------------------------------------
        */

        $product = Product::findOrFail(
            $cartItem->product_id
        );


        /*
        |--------------------------------------------------------------------------
        | Stock Validation
        |--------------------------------------------------------------------------
        */

        if (
            $validated['quantity'] >
            $product->stock
        ) {
            return response()->json([
                'success' => false,

                'message' =>
                    "Only {$product->stock} item(s) are available in stock.",

            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | Update Quantity
        |--------------------------------------------------------------------------
        */

        $cartItem->update([
            'quantity' =>
                $validated['quantity'],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Load Relations
        |--------------------------------------------------------------------------
        */

        $cartItem->load([
            'product.category',
            'product.subcategory'
        ]);


        return response()->json([
            'success' => true,

            'message' =>
                'Cart item updated successfully.',

            'item' =>
                $cartItem,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | REMOVE ONE CART ITEM
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        CartItem $cartItem
    ): JsonResponse {

        /*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        */

        if (
            $cartItem->user_id !==
            $request->user()->id
        ) {
            return response()->json([
                'success' => false,

                'message' =>
                    'You are not allowed to remove this cart item.',

            ], 403);
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Cart Item
        |--------------------------------------------------------------------------
        */

        $cartItem->delete();


        return response()->json([
            'success' => true,

            'message' =>
                'Cart item removed successfully.',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | CLEAR COMPLETE CART
    |--------------------------------------------------------------------------
    */

    public function clear(
        Request $request
    ): JsonResponse {

        CartItem::where(
            'user_id',
            $request->user()->id
        )->delete();


        return response()->json([
            'success' => true,

            'message' =>
                'Cart cleared successfully.',
        ]);
    }
}