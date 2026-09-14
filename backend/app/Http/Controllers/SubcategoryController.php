<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    /**
     * Return all subcategories.
     *
     * Optional:
     * /api/subcategories?category_id=2
     */
    public function index(Request $request): JsonResponse
    {
        $query = Subcategory::query()
            ->select([
                'id',
                'category_id',
                'name',
            ])
            ->orderBy('category_id', 'asc')
            ->orderBy('id', 'asc');

        /*
        |--------------------------------------------------------------------------
        | Optional category filtering
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category_id')) {
            $query->where(
                'category_id',
                $request->category_id
            );
        }

        $subcategories = $query->get();

        return response()->json([
            'success' => true,
            'subcategories' => $subcategories,
        ], 200);
    }
}