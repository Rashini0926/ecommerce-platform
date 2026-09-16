<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->status !== 'ACTIVE') {
            return new JsonResponse([
                'success' => false,
                'message' => $request->user()?->status === 'PENDING'
                    ? 'Your account is awaiting administrator approval.'
                    : 'Your account has been suspended.',
            ], 403);
        }

        return $next($request);
    }
}
