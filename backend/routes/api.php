<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;


/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::post(
    '/register',
    [AuthController::class, 'register']
);

Route::post(
    '/login',
    [AuthController::class, 'login']
);


/*
|--------------------------------------------------------------------------
| Authenticated User Route
|--------------------------------------------------------------------------
*/

Route::get(
    '/user',
    function (Request $request) {
        return $request->user();
    }
)->middleware('auth:sanctum');


/*
|--------------------------------------------------------------------------
| Public Category Routes
|--------------------------------------------------------------------------
*/

Route::get(
    '/categories',
    [CategoryController::class, 'index']
);


/*
|--------------------------------------------------------------------------
| Public Subcategory Routes
|--------------------------------------------------------------------------
*/

Route::get(
    '/subcategories',
    [SubcategoryController::class, 'index']
);


/*
|--------------------------------------------------------------------------
| Public Product Routes
|--------------------------------------------------------------------------
*/

Route::get(
    '/products',
    [ProductController::class, 'index']
);

Route::get(
    '/products/{product}',
    [ProductController::class, 'show']
);


/*
|--------------------------------------------------------------------------
| Public Review Route
|--------------------------------------------------------------------------
|
| Anyone can read product reviews.
|
*/

Route::get(
    '/products/{productId}/reviews',
    [ReviewController::class, 'index']
);


/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/profile',
        [AuthController::class, 'profile']
    );

    Route::post(
        '/logout',
        [AuthController::class, 'logout']
    );


    /*
    |--------------------------------------------------------------------------
    | Wishlist Routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/wishlist',
        [WishlistController::class, 'index']
    );

    Route::post(
        '/wishlist',
        [WishlistController::class, 'store']
    );

    Route::delete(
        '/wishlist/{wishlistItem}',
        [WishlistController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | Cart Routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/cart',
        [CartController::class, 'index']
    );

    Route::post(
        '/cart',
        [CartController::class, 'store']
    );

    Route::patch(
        '/cart/{cartItem}',
        [CartController::class, 'update']
    );

    Route::delete(
        '/cart/{cartItem}',
        [CartController::class, 'destroy']
    );

    Route::delete(
        '/cart',
        [CartController::class, 'clear']
    );


    /*
    |--------------------------------------------------------------------------
    | Customer Order Routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/orders',
        [OrderController::class, 'index']
    );

    Route::post(
        '/orders',
        [OrderController::class, 'store']
    );

    Route::get(
        '/orders/{order}',
        [OrderController::class, 'show']
    );

    Route::patch(
        '/orders/{order}/cancel',
        [OrderController::class, 'cancel']
    );


    /*
    |--------------------------------------------------------------------------
    | Admin Order Routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/orders',
        [OrderController::class, 'adminIndex']
    );

    Route::patch(
        '/admin/orders/{order}/status',
        [OrderController::class, 'updateStatus']
    );


    /*
    |--------------------------------------------------------------------------
    | Seller Product Management Routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/seller/products',
        [ProductController::class, 'mine']
    );

    Route::post(
        '/products',
        [ProductController::class, 'store']
    );

    Route::put(
        '/products/{product}',
        [ProductController::class, 'update']
    );

    Route::delete(
        '/products/{product}',
        [ProductController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | Category Management Routes
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/categories',
        [CategoryController::class, 'store']
    );

    Route::put(
        '/categories/{category}',
        [CategoryController::class, 'update']
    );

    Route::delete(
        '/categories/{category}',
        [CategoryController::class, 'destroy']
    );

    Route::post(
        '/categories/{category}/subcategories',
        [CategoryController::class, 'storeSubcategory']
    );

    Route::delete(
        '/subcategories/{subcategory}',
        [CategoryController::class, 'destroySubcategory']
    );


    /*
    |--------------------------------------------------------------------------
    | Product Review CRUD Routes
    |--------------------------------------------------------------------------
    |
    | CREATE, UPDATE and DELETE require authentication.
    |
    */

    Route::post(
        '/products/{productId}/reviews',
        [ReviewController::class, 'store']
    );

    Route::post(
        '/reviews/{id}',
        [ReviewController::class, 'update']
    );

    Route::delete(
        '/reviews/{id}',
        [ReviewController::class, 'destroy']
    );
});


/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/

Route::get(
    '/test',
    function () {
        return response()->json([
            'message' => 'API is working'
        ]);
    }
);