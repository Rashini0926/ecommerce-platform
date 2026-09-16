<!doctype html>
<html lang="en"><body style="font-family:Arial,sans-serif;color:#1f2937">
  <h2>{{ $heading }}</h2>
  <p>Hello {{ $order->user->full_name }},</p>
  <p>{{ $content }}</p>
  <p><strong>Order number:</strong> {{ $order->order_number }}</p>
  <p><strong>Total:</strong> Rs. {{ number_format($order->total_amount, 2) }}</p>
  <p>Thank you for shopping with ShopEase.</p>
</body></html>
