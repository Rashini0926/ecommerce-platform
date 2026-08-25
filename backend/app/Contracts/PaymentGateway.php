<?php

namespace App\Contracts;

use App\Models\Payment;

interface PaymentGateway
{
    public function initiate(Payment $payment): array;

    public function complete(Payment $payment): array;
}
