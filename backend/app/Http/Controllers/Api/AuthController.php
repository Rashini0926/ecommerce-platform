<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

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
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => $validated['password'],
            'role' => strtoupper($validated['role']),
            'status' => $validated['role'] === 'seller' ? 'PENDING' : 'ACTIVE',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful.',
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

        if (!$user || !Hash::check($validated['password'], $user->password)) {
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
            $status = Password::sendResetLink(
                $credentials,
                function (User $user, string $token) use (&$resetUrl): void {
                    $resetUrl = rtrim(config('app.frontend_url'), '/')
                        . '/reset-password?token=' . $token
                        . '&email=' . urlencode($user->email);
                }
            );
        } else {
            $status = Password::sendResetLink($credentials);
        }

        $successful = $status === Password::RESET_LINK_SENT;
        $response = [
            'success' => $successful,
            'message' => $successful
                ? ($resetUrl ? 'Reset link created for local development.' : 'Password reset link sent. Check your email inbox.')
                : 'Unable to send a password reset link for that email address.',
        ];

        if ($resetUrl) {
            $response['reset_url'] = $resetUrl;
        }

        return response()->json($response, $successful ? 200 : 422);
    }

    public function resetPassword(Request $request)
    {
        $credentials = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
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
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        if (!Hash::check($data['current_password'], $request->user()->password)) {
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
