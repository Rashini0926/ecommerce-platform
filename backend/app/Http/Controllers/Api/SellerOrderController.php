<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class SellerOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureSeller($request);

        $items = OrderItem::query()
            ->where('seller_id', $request->user()->id)
            ->with(['order.user:id,full_name,email,phone', 'product:id,user_id,name,image,stock'])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'order_items' => $items]);
    }

    public function updateStatus(Request $request, OrderItem $orderItem): JsonResponse
    {
        $this->ensureSeller($request);
        abort_unless($orderItem->seller_id === $request->user()->id, 403, 'You can only manage your own order items.');

        $data = $request->validate([
            'fulfillment_status' => ['required', Rule::in(['PROCESSING', 'READY_TO_SHIP', 'SHIPPED'])],
        ]);

        $orderItem->loadMissing('order');

        if ($data['fulfillment_status'] !== $orderItem->fulfillment_status) {
            if (in_array($orderItem->order->order_status, ['CANCELLED', 'DELIVERED'], true)) {
                throw ValidationException::withMessages([
                    'fulfillment_status' => 'Fulfillment cannot be changed for a closed order.',
                ]);
            }

            if ($orderItem->order->payment_method === 'CARD' && $orderItem->order->payment_status !== 'PAID') {
                throw ValidationException::withMessages([
                    'fulfillment_status' => 'Card payment must be completed before preparing this item.',
                ]);
            }

            if ($orderItem->fulfillment_status !== 'PROCESSING' || $data['fulfillment_status'] !== 'READY_TO_SHIP') {
                throw ValidationException::withMessages([
                    'fulfillment_status' => 'Sellers can only move processing items to ready to ship. Shipment is confirmed by an administrator after dispatch.',
                ]);
            }
        }

        $orderItem->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Item fulfillment status updated successfully.',
            'order_item' => $orderItem->fresh(['order.user:id,full_name,email,phone', 'product:id,user_id,name,image,stock']),
        ]);
    }

    private function ensureSeller(Request $request): void
    {
        abort_unless($request->user()->role === 'SELLER', 403, 'Seller access is required.');
    }
}
