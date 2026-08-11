<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with('subcategories')->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);
        $category = Category::create($request->validate(['name' => ['required', 'string', 'max:255', 'unique:categories,name'], 'icon' => ['nullable', 'string', 'max:20']]));
        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $this->ensureAdmin($request);
        $category->update($request->validate(['name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id], 'icon' => ['nullable', 'string', 'max:20']]));
        return response()->json($category);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        $this->ensureAdmin($request);
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully.']);
    }

    public function storeSubcategory(Request $request, Category $category): JsonResponse
    {
        $this->ensureAdmin($request);
        $subcategory = $category->subcategories()->create($request->validate(['name' => ['required', 'string', 'max:255']]));
        return response()->json($subcategory, 201);
    }

    public function destroySubcategory(Request $request, Subcategory $subcategory): JsonResponse
    {
        $this->ensureAdmin($request);
        $subcategory->delete();
        return response()->json(['message' => 'Subcategory deleted successfully.']);
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless(in_array($request->user()->role, ['ADMIN', 'SELLER'], true), 403, 'Catalog manager access is required.');
    }
}
