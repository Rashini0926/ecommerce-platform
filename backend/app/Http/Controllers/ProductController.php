<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Display all products with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with([
            'category',
            'subcategory'
        ]);

        /*
        |--------------------------------------------------------------------------
        | Search by product name / brand / description
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search) {

                $q->where(
                    'name',
                    'like',
                    '%' . $search . '%'
                )

                ->orWhere(
                    'brand',
                    'like',
                    '%' . $search . '%'
                )

                ->orWhere(
                    'description',
                    'like',
                    '%' . $search . '%'
                );

            });
        }

        /*
        |--------------------------------------------------------------------------
        | Filter by category
        |--------------------------------------------------------------------------
        */

        if ($request->filled('category_id')) {

            $query->where(
                'category_id',
                $request->category_id
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Filter by sub category
        |--------------------------------------------------------------------------
        */

        if ($request->filled('subcategory_id')) {

            $query->where(
                'subcategory_id',
                $request->subcategory_id
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Brand
        |--------------------------------------------------------------------------
        */

        if ($request->filled('brand')) {

            $query->where(
                'brand',
                'like',
                '%' . $request->brand . '%'
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Color
        |--------------------------------------------------------------------------
        */

        if ($request->filled('color')) {

            $query->where(
                'color',
                'like',
                '%' . $request->color . '%'
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Size
        |--------------------------------------------------------------------------
        */

        if ($request->filled('size')) {

            $query->where(
                'size',
                'like',
                '%' . $request->size . '%'
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Minimum Price
        |--------------------------------------------------------------------------
        */

        if ($request->filled('min_price')) {

            $query->where(
                'price',
                '>=',
                $request->min_price
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Maximum Price
        |--------------------------------------------------------------------------
        */

        if ($request->filled('max_price')) {

            $query->where(
                'price',
                '<=',
                $request->max_price
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Rating
        |--------------------------------------------------------------------------
        */

        if ($request->filled('min_rating')) {

            $query->where(
                'rating',
                '>=',
                $request->min_rating
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        if ($request->filled('sort')) {

            switch ($request->sort) {

                case 'price_low':
                    $query->orderBy(
                        'price',
                        'asc'
                    );
                    break;

                case 'price_high':
                    $query->orderBy(
                        'price',
                        'desc'
                    );
                    break;

                case 'rating':
                    $query->orderBy(
                        'rating',
                        'desc'
                    );
                    break;

                case 'latest':
                    $query->orderBy(
                        'created_at',
                        'desc'
                    );
                    break;

                default:
                    $query->orderBy(
                        'id',
                        'desc'
                    );
            }

        } else {

            $query->orderBy(
                'id',
                'desc'
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Get Products
        |--------------------------------------------------------------------------
        */

        $products = $query->get();

        return response()->json(
            $products,
            200
        );
    }

    /**
     * Display one selected product.
     */
    public function show($id): JsonResponse
    {
        $product = Product::with([
            'category',
            'subcategory'
        ])->findOrFail($id);

        return response()->json(
            $product,
            200
        );
    }
}