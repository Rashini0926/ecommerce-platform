<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Contracts\PaymentGateway;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DemoPaymentController extends Controller
{
    public function __construct(private PaymentGateway $gateway)
    {
    }

    public function initiate(Request $request, Order $order): JsonResponse
    {
        $this->ensureOwner($request, $order);

        if ($order->payment_method !== 'CARD') {
            throw ValidationException::withMessages(['order' => 'Only card orders use the demo payment gateway.']);
        }

        if ($order->order_status === 'CANCELLED') {
            throw ValidationException::withMessages(['order' => 'Cancelled orders cannot be paid.']);
        }

        $payment = Payment::firstOrCreate(
            ['order_id' => $order->id],
            ['provider' => 'DEMO', 'reference' => 'DEMO-' . Str::upper(Str::random(12)), 'amount' => $order->total_amount, 'currency' => 'LKR'],
        );

        return response()->json([
            'success' => true,
            'message' => $this->gateway->initiate($payment)['message'],
            'payment' => $payment->fresh(),
        ]);
    }

    public function complete(Request $request, Order $order): JsonResponse
    {
        $this->ensureOwner($request, $order);
        $payment = $order->payment;

        if (!$payment) {
            throw ValidationException::withMessages(['payment' => 'Initiate the payment before completing it.']);
        }

        if ($payment->status === 'PAID') {
            return response()->json(['success' => true, 'message' => 'Payment is already complete.', 'payment' => $payment]);
        }

        $result = $this->gateway->complete($payment);

        DB::transaction(function () use ($payment, $order, $result) {
            $payment->update(['status' => $result['status'], 'paid_at' => $result['paid_at']]);
            $order->update(['payment_status' => 'PAID']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Demo payment completed successfully. No real money was charged.',
            'payment' => $payment->fresh(),
        ]);
    }

    private function ensureOwner(Request $request, Order $order): void
    {
        abort_unless($order->user_id === $request->user()->id, 403, 'You are not allowed to pay for this order.');
    }
}
