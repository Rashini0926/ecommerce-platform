<?php

namespace App\Providers;

use App\Contracts\PaymentGateway;
use App\Contracts\SmsGateway;
use App\Services\Notifications\LogSmsGateway;
use App\Services\Payments\DemoPaymentGateway;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentGateway::class, function () {
            return match (config('payments.default')) {
                'demo' => new DemoPaymentGateway,
                default => throw new \RuntimeException('Unsupported payment gateway configuration.'),
            };
        });

        $this->app->bind(SmsGateway::class, function () {
            return match (config('customer_notifications.sms_driver')) {
                'log' => new LogSmsGateway,
                default => throw new \RuntimeException('Unsupported SMS gateway configuration.'),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $user, string $token) {
            return rtrim(config('app.frontend_url'), '/')
                .'/reset-password?token='.$token.'&email='.urlencode($user->email);
        });
    }
}
