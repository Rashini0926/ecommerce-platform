<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET ALL PRODUCTS
    |--------------------------------------------------------------------------
    |
    | Supports:
    | search
    | category_id
    | subcategory_id
    | brand
    | color
    | size
    | min_price
    | max_price
    | min_rating
    |
    */

    public function index(Request $request): JsonResponse
    {
        $query = Product::with([
            'category',
            'subcategory',
            'seller:id,full_name'
        ]);

        /*
        |--------------------------------------------------------------------------
        | SEARCH
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {

            $search = trim($request->search);

            $query->where(function ($q) use ($search) {

                $q->where(
                    'name',
                    'like',
                    '%' . $search . '%'
                )
                ->orWhere(
                    'description',
                    'like',
                    '%' . $search . '%'
                )
                ->orWhere(
                    'brand',
                    'like',
                    '%' . $search . '%'
                );

            });
        }

        /*
        |--------------------------------------------------------------------------
        | CATEGORY FILTER
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
        | SUBCATEGORY FILTER
        |--------------------------------------------------------------------------
        |
        | THIS WAS MISSING BEFORE.
        |
        */

        if ($request->filled('subcategory_id')) {

            $query->where(
                'subcategory_id',
                $request->subcategory_id
            );
        }

        /*
        |--------------------------------------------------------------------------
        | BRAND FILTER
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
        | COLOR FILTER
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
        | SIZE FILTER
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
        | MINIMUM PRICE
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
        | MAXIMUM PRICE
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
        | MINIMUM RATING
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
        | RETURN PRODUCTS
        |--------------------------------------------------------------------------
        */

        $products = $query
            ->latest()
            ->get();

        return response()->json(
            $products
        );
    }

    /*
    |--------------------------------------------------------------------------
    | GET ONE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function show(
        Product $product
    ): JsonResponse {

        $product->load([
            'category',
            'subcategory',
            'seller:id,full_name'
        ]);

        return response()->json(
            $product
        );
    }

    /*
    |--------------------------------------------------------------------------
    | GET LOGGED-IN SELLER PRODUCTS
    |--------------------------------------------------------------------------
    */

    public function mine(
        Request $request
    ): JsonResponse {

        $this->ensureSeller(
            $request
        );

        $products = $request
            ->user()
            ->products()
            ->with([
                'category',
                'subcategory'
            ])
            ->latest()
            ->get();

        return response()->json(
            $products
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ): JsonResponse {

        /*
         * Only SELLER / ADMIN
         */

        $this->ensureSeller(
            $request
        );

        /*
         * Validate product data
         */

        $validated =
            $this->validatedData(
                $request
            );

        /*
         * Create product
         */

        $product =
            $request
                ->user()
                ->products()
                ->create(
                    $validated
                );

        /*
         * Load relationships
         */

        $product->load([
            'category',
            'subcategory',
            'seller:id,full_name'
        ]);

        return response()->json([
            'message' =>
                'Product created successfully.',

            'product' =>
                $product,

        ], 201);
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Product $product
    ): JsonResponse {

        /*
         * Check ownership / permission
         */

        $this->ensureOwner(
            $request,
            $product
        );

        /*
         * Validate
         */

        $validated =
            $this->validatedData(
                $request
            );

        /*
         * Update
         */

        $product->update(
            $validated
        );

        /*
         * Reload relationships
         */

        $product->load([
            'category',
            'subcategory',
            'seller:id,full_name'
        ]);

        return response()->json([
            'message' =>
                'Product updated successfully.',

            'product' =>
                $product,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Request $request,
        Product $product
    ): JsonResponse {

        /*
         * Check ownership / permission
         */

        $this->ensureOwner(
            $request,
            $product
        );

        /*
         * Delete
         */

        $product->delete();

        return response()->json([
            'message' =>
                'Product deleted successfully.'
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE PRODUCT DATA
    |--------------------------------------------------------------------------
    */

    private function validatedData(
        Request $request
    ): array {

        $data = $request->validate([

            /*
            |--------------------------------------------------------------------------
            | CATEGORY
            |--------------------------------------------------------------------------
            */

            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],

            /*
            |--------------------------------------------------------------------------
            | SUBCATEGORY
            |--------------------------------------------------------------------------
            */

            'subcategory_id' => [
                'nullable',
                'integer',
                'exists:subcategories,id',
            ],

            /*
            |--------------------------------------------------------------------------
            | PRODUCT NAME
            |--------------------------------------------------------------------------
            */

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | DESCRIPTION
            |--------------------------------------------------------------------------
            */

            'description' => [
                'nullable',
                'string',
            ],

            /*
            |--------------------------------------------------------------------------
            | PRICE
            |--------------------------------------------------------------------------
            */

            'price' => [
                'required',
                'numeric',
                'min:0',
            ],

            /*
            |--------------------------------------------------------------------------
            | BRAND
            |--------------------------------------------------------------------------
            */

            'brand' => [
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | COLOR
            |--------------------------------------------------------------------------
            */

            'color' => [
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | SIZE
            |--------------------------------------------------------------------------
            */

            'size' => [
                'nullable',
                'string',
                'max:255',
            ],

            /*
            |--------------------------------------------------------------------------
            | IMAGE
            |--------------------------------------------------------------------------
            */

            'image' => [
                'nullable',
                'string',
                'max:2048',
            ],

            /*
            |--------------------------------------------------------------------------
            | STOCK
            |--------------------------------------------------------------------------
            */

            'stock' => [
                'required',
                'integer',
                'min:0',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | CHECK SUBCATEGORY BELONGS TO CATEGORY
        |--------------------------------------------------------------------------
        */

        if (
            !empty(
                $data['subcategory_id']
            )
        ) {

            $belongsToCategory =
                Subcategory::whereKey(
                    $data['subcategory_id']
                )
                    ->where(
                        'category_id',
                        $data['category_id']
                    )
                    ->exists();

            if (
                !$belongsToCategory
            ) {

                throw ValidationException::withMessages([

                    'subcategory_id' =>
                        'The subcategory must belong to the selected category.',

                ]);
            }
        }

        return $data;
    }

    /*
    |--------------------------------------------------------------------------
    | ENSURE USER IS SELLER OR ADMIN
    |--------------------------------------------------------------------------
    */

    private function ensureSeller(
        Request $request
    ): void {

        $role =
            strtoupper(
                $request
                    ->user()
                    ->role
            );

        abort_unless(
            in_array(
                $role,
                [
                    'SELLER',
                    'ADMIN'
                ],
                true
            ),
            403,
            'Seller access is required.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | ENSURE PRODUCT OWNER
    |--------------------------------------------------------------------------
    */

    private function ensureOwner(
        Request $request,
        Product $product
    ): void {

        /*
         * Must first be seller/admin
         */

        $this->ensureSeller(
            $request
        );

        $role =
            strtoupper(
                $request
                    ->user()
                    ->role
            );

        /*
         * ADMIN can manage any product.
         *
         * SELLER can manage only
         * own products.
         */

        abort_unless(
            $role === 'ADMIN' ||
            $product->user_id ===
                $request->user()->id,
            403,
            'You can only manage your own products.'
        );
    }
}