<?php

namespace App\Http\Controllers\Api;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DemoPaymentController extends Controller
{
    public function __construct(private PaymentGateway $gateway) {}

    public function initiate(Request $request, Order $order): JsonResponse
    {
        $this->ensureOwner($request, $order);
        $payment = DB::transaction(function () use ($request, $order) {
            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();
            $this->ensureOwner($request, $lockedOrder);
            $this->ensurePayableCardOrder($lockedOrder);

            return Payment::firstOrCreate(
                ['order_id' => $lockedOrder->id],
                [
                    'provider' => 'DEMO',
                    'reference' => 'DEMO-'.Str::upper(Str::random(12)),
                    'amount' => $lockedOrder->total_amount,
                    'currency' => 'LKR',
                ],
            );
        });

        $gatewayResult = $this->gateway->initiate($payment);

        return response()->json([
            'success' => true,
            'message' => $payment->status === 'PAID'
                ? 'Payment is already complete.'
                : $gatewayResult['message'],
            'payment' => $payment->fresh(),
            'order' => $order->fresh('items.product'),
        ]);
    }

    public function complete(Request $request, Order $order): JsonResponse
    {
        $this->ensureOwner($request, $order);
        [$payment, $paidOrder, $wasCompleted] = DB::transaction(function () use ($request, $order) {
            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();
            $this->ensureOwner($request, $lockedOrder);
            $this->ensurePayableCardOrder($lockedOrder);

            $payment = Payment::where('order_id', $lockedOrder->id)
                ->lockForUpdate()
                ->first();

            if (! $payment) {
                throw ValidationException::withMessages(['payment' => 'Initiate the payment before completing it.']);
            }

            if ($payment->status === 'PAID') {
                return [$payment, $lockedOrder, false];
            }

            $result = $this->gateway->complete($payment);
            $payment->update([
                'status' => $result['status'],
                'paid_at' => $result['paid_at'],
            ]);
            $lockedOrder->update(['payment_status' => 'PAID']);

            UserNotification::create([
                'user_id' => $lockedOrder->user_id,
                'type' => 'PAYMENT',
                'title' => 'Payment received',
                'message' => "Your demo card payment for order {$lockedOrder->order_number} was completed successfully.",
                'data' => [
                    'order_id' => $lockedOrder->id,
                    'order_number' => $lockedOrder->order_number,
                    'payment_reference' => $payment->reference,
                ],
            ]);

            return [$payment->fresh(), $lockedOrder->fresh(), true];
        });

        return response()->json([
            'success' => true,
            'message' => $wasCompleted
                ? 'Demo payment completed successfully. No real money was charged.'
                : 'Payment is already complete.',
            'payment' => $payment->fresh(),
            'order' => $paidOrder->fresh('items.product'),
        ]);
    }

    private function ensureOwner(Request $request, Order $order): void
    {
        abort_unless($order->user_id === $request->user()->id, 403, 'You are not allowed to pay for this order.');
    }

    private function ensurePayableCardOrder(Order $order): void
    {
        if ($order->payment_method !== 'CARD') {
            throw ValidationException::withMessages(['order' => 'Only card orders use the demo payment gateway.']);
        }

        if ($order->order_status === 'CANCELLED') {
            throw ValidationException::withMessages(['order' => 'Cancelled orders cannot be paid.']);
        }
    }
}
