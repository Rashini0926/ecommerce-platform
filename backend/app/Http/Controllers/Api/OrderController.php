<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\Notifications\CustomerNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(private CustomerNotificationService $notifications) {}

    private const STATUS_TRANSITIONS = [
        'PENDING' => ['PROCESSING', 'CANCELLED'],
        'PROCESSING' => ['SHIPPED', 'CANCELLED'],
        'SHIPPED' => ['DELIVERED'],
        'DELIVERED' => [],
        'CANCELLED' => [],
    ];

    public function store(Request $request): JsonResponse
    {
        $this->ensureCustomer($request);
        $validated = $this->validatedCheckoutData($request);

        [$order, $wasCreated] = DB::transaction(function () use ($request, $validated) {
            $customer = User::whereKey($request->user()->id)
                ->lockForUpdate()
                ->firstOrFail();

            $existingOrder = $customer->orders()
                ->where('checkout_token', $validated['checkout_token'])
                ->first();

            if ($existingOrder) {
                return [$existingOrder, false];
            }

            $cartItems = CartItem::where('user_id', $request->user()->id)
                ->orderBy('product_id')
                ->lockForUpdate()
                ->get();

            if ($cartItems->isEmpty()) {
                throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
            }

            $totalAmount = 0;
            $orderItems = [];
            $products = Product::whereIn('id', $cartItems->pluck('product_id'))
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($cartItems as $cartItem) {
                $product = $products->get($cartItem->product_id);

                if (! $product || $product->stock < $cartItem->quantity) {
                    throw ValidationException::withMessages([
                        'cart' => ($product?->name ?? 'A product').' is no longer available in the requested quantity.',
                    ]);
                }

                $unitPrice = $product->sale_price;
                $subtotal = $unitPrice * $cartItem->quantity;
                $totalAmount += $subtotal;
                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $unitPrice,
                    'quantity' => $cartItem->quantity,
                    'subtotal' => $subtotal,
                ];

                $product->decrement('stock', $cartItem->quantity);
            }

            $order = $customer->orders()->create([
                'order_number' => $this->generateOrderNumber(),
                'checkout_token' => $validated['checkout_token'],
                'shipping_address' => $validated['shipping_address'],
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'PENDING',
                'total_amount' => $totalAmount,
                'order_status' => 'PROCESSING',
            ]);

            $order->items()->createMany($orderItems);
            CartItem::where('user_id', $request->user()->id)->delete();

            return [$order, true];
        });

        $order->load('items.product');

        if ($wasCreated) {
            $this->notifyCustomer($order, 'ORDER', 'Order placed successfully', "Your order {$order->order_number} is now being processed.");
        }

        return response()->json([
            'success' => true,
            'message' => $wasCreated ? 'Order placed successfully.' : 'This checkout was already completed.',
            'order' => $order,
        ], $wasCreated ? 201 : 200);
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

    public function adminIndex(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        $orders = Order::with([
            'items.product',
            'user:id,full_name,email,phone',
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'orders' => $orders,
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $this->ensureAdmin($request);
        $previousStatus = $order->order_status;

        $validated = $request->validate([
            'order_status' => ['required', Rule::in(['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])],
        ]);

        $this->validateStatusTransition($order, $validated['order_status']);

        DB::transaction(function () use ($order, $validated) {
            if ($validated['order_status'] === 'CANCELLED' && $order->order_status !== 'CANCELLED') {
                $order->load('items');

                foreach ($order->items as $item) {
                    if ($item->product_id) {
                        Product::whereKey($item->product_id)->increment('stock', $item->quantity);
                    }
                }
            }

            $order->update([
                'order_status' => $validated['order_status'],
                'delivered_at' => $validated['order_status'] === 'DELIVERED' ? ($order->delivered_at ?? now()) : $order->delivered_at,
            ]);
        });

        if ($previousStatus !== $validated['order_status']) {
            $this->notifyCustomer($order, 'ORDER_STATUS', 'Order status updated', "Your order {$order->order_number} is now {$validated['order_status']}.");
        }

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully.',
            'order' => $order->fresh(['items.product', 'user:id,full_name,email,phone']),
        ]);
    }

    public function updateShipping(Request $request, Order $order): JsonResponse
    {
        $this->ensureAdmin($request);

        if (! in_array($order->order_status, ['PROCESSING', 'SHIPPED'], true)) {
            throw ValidationException::withMessages(['order' => 'Only processing or shipped orders can have shipping details updated.']);
        }

        if ($order->payment_method === 'CARD' && $order->payment_status !== 'PAID') {
            throw ValidationException::withMessages(['payment' => 'Card payment must be completed before dispatch.']);
        }

        $data = $request->validate([
            'courier_name' => ['required', 'string', 'max:255'],
            'tracking_number' => ['required', 'string', 'max:255', Rule::unique('orders', 'tracking_number')->ignore($order->id)],
            'shipping_fee' => ['nullable', 'numeric', 'min:0'],
        ]);

        $order->update([
            ...$data,
            'order_status' => 'SHIPPED',
            'shipped_at' => $order->shipped_at ?? now(),
        ]);
        $this->notifyCustomer($order, 'SHIPPING', 'Your order has shipped', "Your order {$order->order_number} is with {$data['courier_name']}. Tracking number: {$data['tracking_number']}.");

        return response()->json([
            'success' => true,
            'message' => 'Shipping details updated successfully.',
            'order' => $order->fresh(['items.product', 'user:id,full_name,email,phone']),
        ]);
    }

    public function tracking(Request $request, Order $order): JsonResponse
    {
        $isOwner = $order->user_id === $request->user()->id;
        $isAdmin = $request->user()->role === 'ADMIN';
        abort_unless($isOwner || $isAdmin, 403, 'You are not allowed to view this shipment.');

        return response()->json([
            'success' => true,
            'tracking' => [
                'order_number' => $order->order_number,
                'order_status' => $order->order_status,
                'courier_name' => $order->courier_name,
                'tracking_number' => $order->tracking_number,
                'shipped_at' => $order->shipped_at,
                'delivered_at' => $order->delivered_at,
            ],
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

    public function cancel(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'You are not allowed to cancel this order.');
        }

        if ($order->order_status !== 'PROCESSING') {
            throw ValidationException::withMessages([
                'order' => 'Only processing orders can be cancelled.',
            ]);
        }

        if ($order->payment_status === 'PAID') {
            throw ValidationException::withMessages([
                'order' => 'Paid orders require a refund before cancellation.',
            ]);
        }

        DB::transaction(function () use ($order) {
            $order->load('items');

            foreach ($order->items as $item) {
                if ($item->product_id) {
                    Product::whereKey($item->product_id)->increment('stock', $item->quantity);
                }
            }

            $order->update(['order_status' => 'CANCELLED']);
        });

        $this->notifyCustomer($order, 'ORDER_STATUS', 'Order cancelled', "Your order {$order->order_number} was cancelled successfully.");

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully.',
            'order' => $order->fresh('items.product'),
        ]);
    }

    private function validatedCheckoutData(Request $request): array
    {
        return $request->validate([
            'checkout_token' => ['required', 'uuid'],
            'shipping_address' => ['required', 'string', 'min:10', 'max:2000'],
            'payment_method' => ['required', Rule::in(['COD', 'CARD'])],
        ]);
    }

    private function ensureCustomer(Request $request): void
    {
        abort_unless($request->user()->role === 'CUSTOMER', 403, 'Only customer accounts can place orders.');
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()->role === 'ADMIN', 403, 'Administrator access is required.');
    }

    private function validateStatusTransition(Order $order, string $nextStatus): void
    {
        if ($nextStatus === $order->order_status) {
            return;
        }

        $allowedStatuses = self::STATUS_TRANSITIONS[$order->order_status] ?? [];

        if (! in_array($nextStatus, $allowedStatuses, true)) {
            throw ValidationException::withMessages([
                'order_status' => "Order status cannot change from {$order->order_status} to {$nextStatus}.",
            ]);
        }

        if ($nextStatus === 'SHIPPED' && (! $order->courier_name || ! $order->tracking_number)) {
            throw ValidationException::withMessages([
                'order_status' => 'Add courier and tracking details before marking the order as shipped.',
            ]);
        }

        if ($nextStatus === 'CANCELLED' && $order->payment_status === 'PAID') {
            throw ValidationException::withMessages([
                'order_status' => 'Paid orders require a refund before cancellation.',
            ]);
        }
    }

    private function generateOrderNumber(): string
    {
        do {
            $orderNumber = 'SE-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
        } while (Order::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }

    private function notifyCustomer(Order $order, string $type, string $title, string $message): void
    {
        $this->notifications->sendOrderUpdate($order, $type, $title, $message);
    }
}
