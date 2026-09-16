<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);
        $query = User::query()->select('id', 'full_name', 'email', 'phone', 'role', 'status', 'created_at');
        if ($request->filled('role')) $query->where('role', $request->role);
        if ($request->filled('status')) $query->where('status', $request->status);
        return response()->json(['success' => true, 'users' => $query->latest()->paginate(20)]);
    }

    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $this->ensureAdmin($request);
        abort_if($user->id === $request->user()->id, 422, 'You cannot change your own account status.');
        $data = $request->validate(['status' => ['required', Rule::in(['PENDING', 'ACTIVE', 'SUSPENDED'])]]);
        $user->update($data);
        if ($data['status'] === 'SUSPENDED') $user->tokens()->delete();
        return response()->json(['success' => true, 'message' => 'User status updated successfully.', 'user' => $user->fresh()]);
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()->role === 'ADMIN', 403, 'Administrator access is required.');
    }
}
