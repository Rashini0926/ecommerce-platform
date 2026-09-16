<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordRecoveryTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_request_a_password_reset_link(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $this->postJson('/api/forgot-password', ['email' => $user->email])
            ->assertOk()
            ->assertJsonPath('success', true);

        Notification::assertSentTo($user, ResetPassword::class);
        $this->assertDatabaseHas('password_reset_tokens', ['email' => $user->email]);
    }

    public function test_customer_can_reset_their_password_with_a_valid_token(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => $token,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])->assertOk()->assertJsonPath('success', true);

        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));
        $this->assertDatabaseMissing('password_reset_tokens', ['email' => $user->email]);
    }

    public function test_local_log_mailer_returns_a_development_reset_link(): void
    {
        Notification::fake();
        $this->app->instance('env', 'local');
        config(['mail.default' => 'log']);
        $user = User::factory()->create();

        $response = $this->postJson('/api/forgot-password', ['email' => $user->email])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['reset_url']);

        $this->assertStringContainsString('/reset-password?token=', $response->json('reset_url'));
        $this->assertStringContainsString(urlencode($user->email), $response->json('reset_url'));
        Notification::assertNothingSent();
    }

    public function test_password_reset_request_does_not_reveal_unknown_accounts(): void
    {
        Notification::fake();

        $this->postJson('/api/forgot-password', ['email' => 'unknown@example.com'])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonMissingPath('reset_url');

        Notification::assertNothingSent();
    }
}
