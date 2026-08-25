<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'subcategory', 'seller:id,full_name']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('color')) {
            $query->where('color', $request->color);
        }

        if ($request->filled('size')) {
            $query->where('size', $request->size);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        $products = $query->get();

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['category', 'subcategory', 'seller:id,full_name']);

        return response()->json($product);
    }

    public function mine(Request $request): JsonResponse
    {
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
            'color' => ['nullable', 'string', 'max:255'], 'size' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'url', 'max:2048'], 'stock' => ['required', 'integer', 'min:0'],
        ]);

        if (!empty($data['subcategory_id'])) {
            $belongsToCategory = \App\Models\Subcategory::whereKey($data['subcategory_id'])
                ->where('category_id', $data['category_id'])->exists();

            if (!$belongsToCategory) {
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
