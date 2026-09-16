<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        abort_unless($request->user()->role === 'CUSTOMER', 403, 'Customer access is required.');

        $user = $request->user();
        $recentOrders = $user->orders()
            ->with(['items:id,order_id,product_name,quantity,subtotal'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'summary' => [
                'total_orders' => $user->orders()->count(),
                'wishlist_items' => $user->wishlistItems()->count(),
                'cart_items' => (int) $user->cartItems()->sum('quantity'),
                'unread_notifications' => $user->notifications()->whereNull('read_at')->count(),
                'saved_addresses' => $user->addresses()->count(),
            ],
            'recent_orders' => $recentOrders,
            'latest_order' => $recentOrders->first(),
        ]);
    }
}
