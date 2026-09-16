<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'integer', 'exists:subcategories,id'],
            'brand' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:100'],
            'size' => ['nullable', 'string', 'max:100'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'min_rating' => ['nullable', 'numeric', 'between:0,5'],
            'sort' => ['nullable', Rule::in(['latest', 'price_asc', 'price_desc', 'rating', 'name'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'between:1,48'],
        ]);

        if (isset($filters['min_price'], $filters['max_price']) && $filters['max_price'] < $filters['min_price']) {
            throw ValidationException::withMessages(['max_price' => 'The maximum price must be greater than or equal to the minimum price.']);
        }

        $query = Product::visibleToCustomers()->with(['category', 'subcategory', 'seller:id,full_name']);
        $effectivePrice = '(price * (1 - discount_percentage / 100.0))';

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($searchQuery) use ($search) {
                $searchQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (! empty($filters['subcategory_id'])) {
            $query->where('subcategory_id', $filters['subcategory_id']);
        }

        if (! empty($filters['brand'])) {
            $query->where('brand', $filters['brand']);
        }

        if (! empty($filters['color'])) {
            $query->where('color', $filters['color']);
        }

        if (! empty($filters['size'])) {
            $query->where('size', $filters['size']);
        }

        if (isset($filters['min_price'])) {
            $query->whereRaw("{$effectivePrice} >= CAST(? AS DECIMAL(12, 2))", [$filters['min_price']]);
        }

        if (isset($filters['max_price'])) {
            $query->whereRaw("{$effectivePrice} <= CAST(? AS DECIMAL(12, 2))", [$filters['max_price']]);
        }

        if (isset($filters['min_rating'])) {
            $query->where('rating', '>=', $filters['min_rating']);
        }

        match ($filters['sort'] ?? 'latest') {
            'price_asc' => $query->orderByRaw("{$effectivePrice} asc"),
            'price_desc' => $query->orderByRaw("{$effectivePrice} desc"),
            'rating' => $query->orderByDesc('rating'),
            'name' => $query->orderBy('name'),
            default => $query->latest(),
        };

        $products = $query->paginate($filters['per_page'] ?? 12);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function homepage(): JsonResponse
    {
        $catalogue = Product::query()
            ->visibleToCustomers()
            ->with(['category', 'subcategory', 'seller:id,full_name'])
            ->where('stock', '>', 0);

        $featuredProducts = (clone $catalogue)
            ->orderByDesc('rating')
            ->latest()
            ->limit(4)
            ->get();

        $flashDeals = (clone $catalogue)
            ->where('discount_percentage', '>', 0)
            ->orderByDesc('discount_percentage')
            ->limit(4)
            ->get();

        $bestSellers = (clone $catalogue)
            ->withSum([
                'orderItems as units_sold' => fn ($query) => $query->whereHas(
                    'order',
                    fn ($orderQuery) => $orderQuery->where('order_status', '!=', 'CANCELLED')
                ),
            ], 'quantity')
            ->orderByDesc('units_sold')
            ->orderByDesc('rating')
            ->limit(4)
            ->get();

        return response()->json([
            'featured_products' => $featuredProducts,
            'flash_deals' => $flashDeals,
            'best_sellers' => $bestSellers,
        ]);
    }

    public function show(Product $product): JsonResponse
    {
        abort_unless($product->isVisibleToCustomers(), 404);
        $product->load(['category', 'subcategory', 'seller:id,full_name']);

        return response()->json($product);
    }

    public function mine(Request $request): JsonResponse
    {
        $this->ensureSeller($request);

        return response()->json($request->user()->products()->with(['category', 'subcategory'])->latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureSeller($request);
        $product = $request->user()->products()->create($this->validatedData($request));

        return response()->json($product->load(['category', 'subcategory']), 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $this->ensureOwner($request, $product);
        $product->update($this->validatedData($request));

        return response()->json($product->load(['category', 'subcategory']));
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $this->ensureOwner($request, $product);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully.']);
    }

    private function validatedData(Request $request): array
    {
        $data = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'integer', 'exists:subcategories,id'],
            'name' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'], 'brand' => ['nullable', 'string', 'max:255'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:90'],
            'color' => ['nullable', 'string', 'max:255'], 'size' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'url', 'max:2048'], 'stock' => ['required', 'integer', 'min:0'],
        ]);

        if (! empty($data['subcategory_id'])) {
            $belongsToCategory = Subcategory::whereKey($data['subcategory_id'])
                ->where('category_id', $data['category_id'])->exists();

            if (! $belongsToCategory) {
                throw ValidationException::withMessages(['subcategory_id' => 'The subcategory must belong to the selected category.']);
            }
        }

        return $data;
    }

    private function ensureSeller(Request $request): void
    {
        abort_unless(in_array($request->user()->role, ['SELLER', 'ADMIN'], true), 403, 'Seller access is required.');
    }

    private function ensureOwner(Request $request, Product $product): void
    {
        $this->ensureSeller($request);
        abort_unless($request->user()->role === 'ADMIN' || $product->user_id === $request->user()->id, 403, 'You can only manage your own products.');
    }
}
