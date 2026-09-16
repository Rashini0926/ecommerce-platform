<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class AuthController extends Controller
{
    // Register
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:15',
            'role' => 'required|in:customer,seller',
            'password' => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()],
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => $validated['password'],
            'role' => strtoupper($validated['role']),
            'status' => $validated['role'] === 'seller' ? 'PENDING' : 'ACTIVE',
        ]);

        $requiresApproval = $user->status === 'PENDING';
        $token = $requiresApproval ? null : $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => $requiresApproval
                ? 'Seller application submitted. You can log in after administrator approval.'
                : 'Registration successful.',
            'requires_approval' => $requiresApproval,
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    // Login
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if ($user->status !== 'ACTIVE') {
            return response()->json(['success' => false, 'message' => $user->status === 'PENDING' ? 'Your account is awaiting administrator approval.' : 'Your account has been suspended.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $credentials = $request->validate(['email' => ['required', 'email']]);
        $resetUrl = null;

        if (app()->environment('local') && config('mail.default') === 'log') {
            Password::sendResetLink(
                $credentials,
                function (User $user, string $token) use (&$resetUrl): void {
                    $resetUrl = rtrim(config('app.frontend_url'), '/')
                        .'/reset-password?token='.$token
                        .'&email='.urlencode($user->email);
                }
            );
        } else {
            Password::sendResetLink($credentials);
        }

        $response = [
            'success' => true,
            'message' => $resetUrl
                ? 'Reset link created for local development.'
                : 'If an account exists for that email address, a password reset link has been sent.',
        ];

        if ($resetUrl) {
            $response['reset_url'] = $resetUrl;
        }

        return response()->json($response);
    }

    public function resetPassword(Request $request)
    {
        $credentials = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()],
        ]);

        $status = Password::reset($credentials, function (User $user, string $password) {
            $user->forceFill([
                'password' => $password,
                'remember_token' => Str::random(60),
            ])->save();

            $user->tokens()->delete();
        });

        return response()->json([
            'success' => $status === Password::PASSWORD_RESET,
            'message' => __($status),
        ], $status === Password::PASSWORD_RESET ? 200 : 422);
    }

    // Profile
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
        ]);
        $request->user()->update($data);

        return response()->json(['success' => true, 'message' => 'Profile updated successfully.', 'user' => $request->user()->fresh()]);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->mixedCase()->numbers()],
        ]);
        if (! Hash::check($data['current_password'], $request->user()->password)) {
            return response()->json(['success' => false, 'message' => 'Current password is incorrect.'], 422);
        }
        $request->user()->update(['password' => $data['password']]);
        $request->user()->tokens()->delete();

        return response()->json(['success' => true, 'message' => 'Password changed. Please log in again.']);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful.',
        ]);
    }
}
