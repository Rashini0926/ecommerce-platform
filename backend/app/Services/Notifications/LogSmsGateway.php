<?php

namespace App\Services\Notifications;

use App\Contracts\SmsGateway;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LogSmsGateway implements SmsGateway
{
    public function send(string $recipient, string $message): array
    {
        $reference = 'SMS-DEMO-'.Str::upper(Str::random(12));

        Log::info('Demo SMS notification dispatched.', [
            'reference' => $reference,
            'recipient' => $this->maskRecipient($recipient),
            'message' => $message,
        ]);

        return [
            'provider' => 'DEMO_LOG',
            'reference' => $reference,
            'status' => 'SENT',
            'dispatched_at' => now(),
        ];
    }

    private function maskRecipient(string $recipient): string
    {
        if (strlen($recipient) <= 4) {
            return str_repeat('*', strlen($recipient));
        }

        return str_repeat('*', strlen($recipient) - 4).substr($recipient, -4);
    }
}
