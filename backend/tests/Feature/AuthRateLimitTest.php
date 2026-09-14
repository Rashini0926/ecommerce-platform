<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRateLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_is_rate_limited_after_repeated_failed_attempts(): void
    {
        $credentials = [
            'email' => 'unknown@example.com',
            'password' => 'IncorrectPassword123!',
        ];

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/login', $credentials)->assertUnauthorized();
        }

        $this->postJson('/api/login', $credentials)->assertTooManyRequests();
    }
}
