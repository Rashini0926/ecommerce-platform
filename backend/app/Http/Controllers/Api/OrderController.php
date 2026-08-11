<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $this->ensureCustomer($request);
        $validated = $this->validatedCheckoutData($request);

        $order = DB::transaction(function () use ($request, $validated) {
            $cartItems = CartItem::where('user_id', $request->user()->id)
                ->with('product')
                ->lockForUpdate()
                ->get();

            if ($cartItems->isEmpty()) {
                throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
            }

            $totalAmount = 0;
            $orderItems = [];

            foreach ($cartItems as $cartItem) {
                $product = Product::lockForUpdate()->find($cartItem->product_id);

                if (!$product || $product->stock < $cartItem->quantity) {
                    throw ValidationException::withMessages([
                        'cart' => "{$cartItem->product?->name} is no longer available in the requested quantity.",
                    ]);
                }

                $subtotal = $product->price * $cartItem->quantity;
                $totalAmount += $subtotal;
                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $cartItem->quantity,
                    'subtotal' => $subtotal,
                ];

                $product->decrement('stock', $cartItem->quantity);
            }

            $isCardPayment = $validated['payment_method'] === 'CARD';
            $order = $request->user()->orders()->create([
                'order_number' => $this->generateOrderNumber(),
                'shipping_address' => $validated['shipping_address'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => $isCardPayment ? 'PAID' : 'PENDING',
                'total_amount' => $totalAmount,
                'order_status' => 'PROCESSING',
            ]);

            $order->items()->createMany($orderItems);
            CartItem::where('user_id', $request->user()->id)->delete();

            return $order;
        });

        $order->load('items.product');

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'order' => $order,
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to view this order.');
        }

        $order->load(['items.product', 'user:id,full_name,email,phone']);

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    private function validatedCheckoutData(Request $request): array
    {
        return $request->validate([
            'shipping_address' => ['required', 'string', 'min:10', 'max:2000'],
            'payment_method' => ['required', Rule::in(['COD', 'CARD'])],
        ]);
    }

    private function ensureCustomer(Request $request): void
    {
        abort_unless($request->user()->role === 'CUSTOMER', 403, 'Only customer accounts can place orders.');
    }

    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'SE-' . now()->format('Ymd') . '-' . Str::upper(Str::random(6));
        } while (Order::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}
