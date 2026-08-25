<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function adminSummary(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);
        return response()->json(['success' => true, 'summary' => [
            'total_users' => User::count(),
            'active_sellers' => User::where('role', 'SELLER')->where('status', 'ACTIVE')->count(),
            'total_orders' => Order::count(),
            'paid_revenue' => (float) Order::where('payment_status', 'PAID')->sum('total_amount'),
            'orders_by_status' => Order::select('order_status', DB::raw('count(*) as count'))->groupBy('order_status')->pluck('count', 'order_status'),
        ]]);
    }

    public function sellerSummary(Request $request): JsonResponse
    {
        abort_unless(in_array($request->user()->role, ['SELLER', 'ADMIN'], true), 403, 'Seller access is required.');
        $sellerId = $request->user()->id;
        $items = OrderItem::whereHas('product', fn ($query) => $query->where('user_id', $sellerId));
        return response()->json(['success' => true, 'summary' => [
            'active_products' => Product::where('user_id', $sellerId)->count(),
            'low_stock_products' => Product::where('user_id', $sellerId)->where('stock', '<=', 5)->count(),
            'order_items' => $items->count(),
            'sales_value' => (float) (clone $items)->sum('subtotal'),
            'top_products' => (clone $items)->select('product_name', DB::raw('sum(quantity) as units_sold'), DB::raw('sum(subtotal) as revenue'))->groupBy('product_name')->orderByDesc('units_sold')->limit(5)->get(),
        ]]);
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()->role === 'ADMIN', 403, 'Administrator access is required.');
    }
}
