<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use App\Models\Payment;

class DemoPaymentGateway implements PaymentGateway
{
    public function initiate(Payment $payment): array
    {
        return [
            'provider' => 'DEMO',
            'reference' => $payment->reference,
            'message' => 'Demo payment initiated. No real money will be charged.',
        ];
    }

    public function complete(Payment $payment): array
    {
        return [
            'status' => 'PAID',
            'paid_at' => now(),
        ];
    }
}
