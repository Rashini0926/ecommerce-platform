<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProductReviewController extends Controller
{
    public function index(Product $product): JsonResponse
    {
        $reviews = $product->reviews()
            ->with('user:id,full_name')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function store(Request $request, Product $product): JsonResponse
    {
        $this->ensureCustomerPurchasedProduct($request, $product);

        $data = $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $review = DB::transaction(function () use ($request, $product, $data) {
            $review = ProductReview::updateOrCreate(
                ['product_id' => $product->id, 'user_id' => $request->user()->id],
                $data,
            );

            $this->refreshProductRating($product);

            return $review;
        });

        return response()->json([
            'success' => true,
            'message' => 'Review saved successfully.',
            'review' => $review->load('user:id,full_name'),
        ], 201);
    }

    public function destroy(Request $request, Product $product, ProductReview $review): JsonResponse
    {
        abort_unless($review->product_id === $product->id, 404);
        abort_unless($review->user_id === $request->user()->id, 403, 'You can only delete your own review.');

        DB::transaction(function () use ($review, $product) {
            $review->delete();
            $this->refreshProductRating($product);
        });

        return response()->json(['success' => true, 'message' => 'Review deleted successfully.']);
    }

    private function ensureCustomerPurchasedProduct(Request $request, Product $product): void
    {
        abort_unless($request->user()->role === 'CUSTOMER', 403, 'Only customer accounts can submit reviews.');

        $hasDeliveredOrder = $request->user()->orders()
            ->where('order_status', 'DELIVERED')
            ->whereHas('items', fn ($query) => $query->where('product_id', $product->id))
            ->exists();

        if (!$hasDeliveredOrder) {
            throw ValidationException::withMessages([
                'product' => 'You can review this product only after a delivered purchase.',
            ]);
        }
    }

    private function refreshProductRating(Product $product): void
    {
        $product->update([
            'rating' => round((float) $product->reviews()->avg('rating'), 1),
        ]);
    }
}
