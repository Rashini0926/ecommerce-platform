<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $this->ensureCustomer($request);
        $this->validatedCheckoutData($request);

        return response()->json([
            'success' => false,
            'message' => 'Order creation will be enabled in the next checkout step.',
        ], 501);
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
}
