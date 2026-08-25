<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use App\Contracts\PaymentGateway;
use App\Services\Payments\DemoPaymentGateway;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentGateway::class, function () {
            return match (config('payments.default')) {
                'demo' => new DemoPaymentGateway(),
                default => throw new \RuntimeException('Unsupported payment gateway configuration.'),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $user, string $token) {
            return rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/')
                . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
        });
    }
}
