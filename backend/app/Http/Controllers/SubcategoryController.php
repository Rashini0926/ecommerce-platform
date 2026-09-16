<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use Illuminate\Http\JsonResponse;

class SubcategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $subcategories = Subcategory::orderBy('category_id', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($subcategories, 200);
    }
}