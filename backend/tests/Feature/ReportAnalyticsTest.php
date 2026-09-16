<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_report_filters_orders_and_builds_a_complete_daily_trend(): void
    {
        $admin = $this->user('ADMIN');
        $customer = $this->user('CUSTOMER');
        $seller = $this->user('SELLER');
        $product = $this->product($seller, 'Wireless Headphones');

        $paidOrder = $this->order($customer, 'REPORT-001', 'PAID', 'DELIVERED', 2500, '2026-09-03 10:00:00');
        $this->item($paidOrder, $product, 2, 2500);
        $pendingOrder = $this->order($customer, 'REPORT-002', 'PENDING', 'PROCESSING', 900, '2026-09-05 10:00:00');
        $this->item($pendingOrder, $product, 1, 900);
        $oldOrder = $this->order($customer, 'REPORT-003', 'PAID', 'DELIVERED', 8000, '2026-08-01 10:00:00');
        $this->item($oldOrder, $product, 1, 8000);

        Sanctum::actingAs($admin);

        $this->getJson('/api/admin/reports/summary?from=2026-09-01&to=2026-09-10')
            ->assertOk()
            ->assertJsonPath('period.days', 10)
            ->assertJsonPath('summary.total_orders', 2)
            ->assertJsonPath('summary.paid_orders', 1)
            ->assertJsonPath('summary.paid_revenue', 2500)
            ->assertJsonPath('summary.average_order_value', 2500)
            ->assertJsonPath('summary.orders_by_status.DELIVERED', 1)
            ->assertJsonPath('summary.orders_by_status.PROCESSING', 1)
            ->assertJsonPath('summary.orders_by_status.CANCELLED', 0)
            ->assertJsonCount(10, 'summary.revenue_trend')
            ->assertJsonPath('summary.revenue_trend.2.date', '2026-09-03')
            ->assertJsonPath('summary.revenue_trend.2.revenue', 2500)
            ->assertJsonPath('summary.top_products.0.product_name', 'Wireless Headphones')
            ->assertJsonPath('summary.top_products.0.units_sold', 2);
    }

    public function test_seller_report_only_counts_their_paid_sales_in_the_selected_period(): void
    {
        $seller = $this->user('SELLER');
        $otherSeller = $this->user('SELLER');
        $customer = $this->user('CUSTOMER');
        $sellerProduct = $this->product($seller, 'Seller Laptop', 3);
        $otherProduct = $this->product($otherSeller, 'Other Laptop');

        $paidOrder = $this->order($customer, 'SELLER-REPORT-001', 'PAID', 'PROCESSING', 6500, '2026-09-04 10:00:00');
        $this->item($paidOrder, $sellerProduct, 2, 5000);
        $this->item($paidOrder, $otherProduct, 1, 1500);
        $unpaidOrder = $this->order($customer, 'SELLER-REPORT-002', 'PENDING', 'PROCESSING', 2000, '2026-09-06 10:00:00');
        $this->item($unpaidOrder, $sellerProduct, 1, 2000);

        Sanctum::actingAs($seller);

        $this->getJson('/api/seller/reports/summary?from=2026-09-01&to=2026-09-10')
            ->assertOk()
            ->assertJsonPath('summary.active_products', 1)
            ->assertJsonPath('summary.low_stock_products', 1)
            ->assertJsonPath('summary.total_orders', 2)
            ->assertJsonPath('summary.order_items', 2)
            ->assertJsonPath('summary.units_sold', 2)
            ->assertJsonPath('summary.paid_revenue', 5000)
            ->assertJsonPath('summary.pending_fulfillment', 2)
            ->assertJsonPath('summary.top_products.0.product_name', 'Seller Laptop')
            ->assertJsonMissing(['product_name' => 'Other Laptop']);
    }

    public function test_report_range_is_validated_and_limited(): void
    {
        Sanctum::actingAs($this->user('ADMIN'));

        $this->getJson('/api/admin/reports/summary?from=2026-09-10&to=2026-09-01')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('to');

        $this->getJson('/api/admin/reports/summary?from=2025-01-01&to=2026-09-01')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('from');
    }

    private function user(string $role): User
    {
        return User::factory()->create([
            'role' => $role,
            'status' => 'ACTIVE',
        ]);
    }

    private function product(User $seller, string $name, int $stock = 10): Product
    {
        return Product::create([
            'user_id' => $seller->id,
            'category_id' => Category::firstOrCreate(['name' => 'Electronics'])->id,
            'name' => $name,
            'price' => 2500,
            'stock' => $stock,
        ]);
    }

    private function order(
        User $customer,
        string $number,
        string $paymentStatus,
        string $orderStatus,
        float $total,
        string $createdAt
    ): Order {
        $order = Order::create([
            'user_id' => $customer->id,
            'order_number' => $number,
            'shipping_address' => '10 Main Street, Colombo',
            'payment_method' => 'CARD',
            'payment_status' => $paymentStatus,
            'total_amount' => $total,
            'order_status' => $orderStatus,
        ]);
        $order->forceFill(['created_at' => $createdAt])->saveQuietly();

        return $order;
    }

    private function item(Order $order, Product $product, int $quantity, float $subtotal): OrderItem
    {
        return OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->name,
            'unit_price' => $subtotal / $quantity,
            'quantity' => $quantity,
            'subtotal' => $subtotal,
        ]);
    }
}
