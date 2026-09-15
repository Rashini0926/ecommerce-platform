<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\CarbonImmutable;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    public function adminSummary(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);
        [$from, $to] = $this->reportPeriod($request);

        $ordersQuery = Order::query()->whereBetween('created_at', [$from, $to]);
        $paidOrdersQuery = (clone $ordersQuery)->where('payment_status', 'PAID');
        $paidRevenue = (float) (clone $paidOrdersQuery)->sum('total_amount');
        $paidOrders = (clone $paidOrdersQuery)->count();
        $orders = (clone $ordersQuery)->get(['created_at', 'payment_status', 'total_amount']);

        $topProducts = OrderItem::query()
            ->whereHas('order', fn (Builder $query) => $query
                ->where('payment_status', 'PAID')
                ->whereBetween('created_at', [$from, $to]))
            ->select(
                'product_name',
                DB::raw('sum(quantity) as units_sold'),
                DB::raw('sum(subtotal) as revenue')
            )
            ->groupBy('product_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn (OrderItem $item) => [
                'product_name' => $item->product_name,
                'units_sold' => (int) $item->units_sold,
                'revenue' => (float) $item->revenue,
            ]);

        return response()->json([
            'success' => true,
            'period' => $this->periodPayload($from, $to),
            'summary' => [
                'total_users' => User::count(),
                'new_customers' => User::where('role', 'CUSTOMER')->whereBetween('created_at', [$from, $to])->count(),
                'active_sellers' => User::where('role', 'SELLER')->where('status', 'ACTIVE')->count(),
                'total_products' => Product::count(),
                'total_orders' => (clone $ordersQuery)->count(),
                'paid_orders' => $paidOrders,
                'paid_revenue' => $paidRevenue,
                'average_order_value' => $paidOrders > 0 ? round($paidRevenue / $paidOrders, 2) : 0,
                'orders_by_status' => $this->ordersByStatus($ordersQuery),
                'revenue_trend' => $this->revenueTrend($orders, $from, $to),
                'top_products' => $topProducts,
            ],
        ]);
    }

    public function sellerSummary(Request $request): JsonResponse
    {
        abort_unless(in_array($request->user()->role, ['SELLER', 'ADMIN'], true), 403, 'Seller access is required.');
        [$from, $to] = $this->reportPeriod($request);
        $sellerId = $request->user()->id;

        $itemsQuery = $this->sellerItemsQuery($sellerId)
            ->whereHas('order', fn (Builder $query) => $query->whereBetween('created_at', [$from, $to]));
        $paidItemsQuery = (clone $itemsQuery)
            ->whereHas('order', fn (Builder $query) => $query->where('payment_status', 'PAID'));
        $paidItems = (clone $paidItemsQuery)
            ->with('order:id,created_at')
            ->get(['id', 'order_id', 'subtotal']);

        $topProducts = (clone $paidItemsQuery)
            ->select(
                'product_name',
                DB::raw('sum(quantity) as units_sold'),
                DB::raw('sum(subtotal) as revenue')
            )
            ->groupBy('product_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn (OrderItem $item) => [
                'product_name' => $item->product_name,
                'units_sold' => (int) $item->units_sold,
                'revenue' => (float) $item->revenue,
            ]);

        $sellerOrdersQuery = Order::query()
            ->whereBetween('created_at', [$from, $to])
            ->whereHas('items.product', fn (Builder $query) => $query->where('user_id', $sellerId));

        return response()->json([
            'success' => true,
            'period' => $this->periodPayload($from, $to),
            'summary' => [
                'active_products' => Product::where('user_id', $sellerId)->count(),
                'low_stock_products' => Product::where('user_id', $sellerId)->where('stock', '<=', 5)->count(),
                'total_orders' => (clone $sellerOrdersQuery)->count(),
                'order_items' => (clone $itemsQuery)->count(),
                'units_sold' => (int) (clone $paidItemsQuery)->sum('quantity'),
                'paid_revenue' => (float) (clone $paidItemsQuery)->sum('subtotal'),
                'pending_fulfillment' => (clone $itemsQuery)
                    ->where('fulfillment_status', '!=', 'SHIPPED')
                    ->whereHas('order', fn (Builder $query) => $query->where('order_status', '!=', 'CANCELLED'))
                    ->count(),
                'orders_by_status' => $this->ordersByStatus($sellerOrdersQuery),
                'revenue_trend' => $this->sellerRevenueTrend($paidItems, $from, $to),
                'top_products' => $topProducts,
            ],
        ]);
    }

    /**
     * @return array{CarbonImmutable, CarbonImmutable}
     */
    private function reportPeriod(Request $request): array
    {
        $validated = $request->validate([
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
        ]);

        $to = isset($validated['to'])
            ? CarbonImmutable::createFromFormat('Y-m-d', $validated['to'])->endOfDay()
            : CarbonImmutable::today()->endOfDay();
        $from = isset($validated['from'])
            ? CarbonImmutable::createFromFormat('Y-m-d', $validated['from'])->startOfDay()
            : $to->startOfDay()->subDays(29);

        if ($from->greaterThan($to)) {
            throw ValidationException::withMessages(['from' => 'The start date must be before or equal to the end date.']);
        }

        if ($from->diffInDays($to) > 365) {
            throw ValidationException::withMessages(['from' => 'Reports can cover a maximum of 366 days.']);
        }

        return [$from, $to];
    }

    private function periodPayload(CarbonImmutable $from, CarbonImmutable $to): array
    {
        return [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'days' => $from->startOfDay()->diffInDays($to->startOfDay()) + 1,
        ];
    }

    private function ordersByStatus(Builder $query): array
    {
        $counts = (clone $query)
            ->select('order_status', DB::raw('count(*) as aggregate'))
            ->groupBy('order_status')
            ->pluck('aggregate', 'order_status');

        return collect(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
            ->mapWithKeys(fn (string $status) => [$status => (int) ($counts[$status] ?? 0)])
            ->all();
    }

    private function revenueTrend(Collection $orders, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $ordersByDay = $orders->groupBy(fn (Order $order) => $order->created_at->toDateString());

        return $this->dailyTrend($from, $to, function (string $date) use ($ordersByDay): array {
            $dayOrders = $ordersByDay->get($date, collect());

            return [
                'orders' => $dayOrders->count(),
                'revenue' => round((float) $dayOrders
                    ->where('payment_status', 'PAID')
                    ->sum(fn (Order $order) => (float) $order->total_amount), 2),
            ];
        });
    }

    private function sellerRevenueTrend(Collection $items, CarbonImmutable $from, CarbonImmutable $to): array
    {
        $itemsByDay = $items->groupBy(fn (OrderItem $item) => $item->order->created_at->toDateString());

        return $this->dailyTrend($from, $to, function (string $date) use ($itemsByDay): array {
            $dayItems = $itemsByDay->get($date, collect());

            return [
                'orders' => $dayItems->pluck('order_id')->unique()->count(),
                'revenue' => round((float) $dayItems->sum(fn (OrderItem $item) => (float) $item->subtotal), 2),
            ];
        });
    }

    private function dailyTrend(CarbonImmutable $from, CarbonImmutable $to, callable $valuesForDate): array
    {
        return collect(CarbonPeriod::create($from->startOfDay(), $to->startOfDay()))
            ->map(function ($day) use ($valuesForDate): array {
                $date = $day->toDateString();

                return ['date' => $date, ...$valuesForDate($date)];
            })
            ->values()
            ->all();
    }

    private function sellerItemsQuery(int $sellerId): Builder
    {
        return OrderItem::query()
            ->whereHas('product', fn (Builder $query) => $query->where('user_id', $sellerId));
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()->role === 'ADMIN', 403, 'Administrator access is required.');
    }
}
