<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountSummaryController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $counts = [
            'unread_notifications' => $user->notifications()->whereNull('read_at')->count(),
            'wishlist_items' => 0,
            'cart_items' => 0,
        ];

        if ($user->role === 'CUSTOMER') {
            $counts['wishlist_items'] = $user->wishlistItems()->count();
            $counts['cart_items'] = (int) $user->cartItems()->sum('quantity');
        }

        return response()->json([
            'success' => true,
            'counts' => $counts,
        ]);
    }
}
