<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::with(['subcategories' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get();

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
        $category->update($request->validate(['name' => ['required', 'string', 'max:255', 'unique:categories,name,'.$category->id], 'icon' => ['nullable', 'string', 'max:20']]));

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        $this->ensureAdmin($request);
        if ($category->products()->exists()) {
            throw ValidationException::withMessages([
                'category' => 'Move or delete this category\'s products before deleting the category.',
            ]);
        }
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }

    public function storeSubcategory(Request $request, Category $category): JsonResponse
    {
        $this->ensureAdmin($request);
        $subcategory = $category->subcategories()->create($request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subcategories', 'name')->where(
                    fn ($query) => $query->where('category_id', $category->id)
                ),
            ],
        ]));

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
        abort_unless($request->user()->role === 'ADMIN', 403, 'Administrator access is required.');
    }
}
