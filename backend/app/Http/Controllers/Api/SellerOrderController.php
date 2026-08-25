<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SellerOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureSeller($request);

        $items = OrderItem::query()
            ->whereHas('product', fn ($query) => $query->where('user_id', $request->user()->id))
            ->with(['order.user:id,full_name,email,phone', 'product:id,user_id,name,image,stock'])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'order_items' => $items]);
    }

    public function updateStatus(Request $request, OrderItem $orderItem): JsonResponse
    {
        $this->ensureSeller($request);
        abort_unless($orderItem->product?->user_id === $request->user()->id, 403, 'You can only manage your own order items.');

        $data = $request->validate([
            'fulfillment_status' => ['required', Rule::in(['PROCESSING', 'READY_TO_SHIP', 'SHIPPED'])],
        ]);

        $orderItem->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Item fulfillment status updated successfully.',
            'order_item' => $orderItem->fresh(['order.user:id,full_name,email,phone', 'product:id,user_id,name,image,stock']),
        ]);
    }

    private function ensureSeller(Request $request): void
    {
        abort_unless(in_array($request->user()->role, ['SELLER', 'ADMIN'], true), 403, 'Seller access is required.');
    }
}
