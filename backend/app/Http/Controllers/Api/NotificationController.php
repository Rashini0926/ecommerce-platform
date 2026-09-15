<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->notifications();
        $unreadCount = (clone $notifications)->whereNull('read_at')->count();

        return response()->json([
            'success' => true,
            'unread_count' => $unreadCount,
            'notifications' => $notifications
                ->with('deliveries')
                ->latest()
                ->paginate(20),
        ]);
    }

    public function markRead(Request $request, UserNotification $notification): JsonResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);
        $notification->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'notification' => $notification->fresh('deliveries'),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->notifications()->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['success' => true, 'message' => 'All notifications marked as read.']);
    }
}
