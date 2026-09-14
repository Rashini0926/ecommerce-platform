<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SubcategoryController;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductReviewController;
use App\Http\Controllers\Api\DemoPaymentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\SellerOrderController;

/*
|--------------------------------------------------------------------------
| PUBLIC AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [
    AuthController::class,
    'register'
]);

Route::post('/login', [
    AuthController::class,
    'login'
]);

Route::post('/forgot-password', [
    AuthController::class,
    'forgotPassword'
]);

Route::post('/reset-password', [
    AuthController::class,
    'resetPassword'
]);

/*
|--------------------------------------------------------------------------
| PUBLIC CATEGORY ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/categories', [
    CategoryController::class,
    'index'
]);

/*
|--------------------------------------------------------------------------
| PUBLIC SUBCATEGORY ROUTES
|--------------------------------------------------------------------------
|
| This route is required by Products.jsx.
|
| Examples:
|
| GET /api/subcategories
|
| GET /api/subcategories?category_id=1
|
*/

Route::get('/subcategories', [
    SubcategoryController::class,
    'index'
]);

/*
|--------------------------------------------------------------------------
| PUBLIC PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

Route::get('/products', [
    ProductController::class,
    'index'
]);

Route::get('/products/{product}', [
    ProductController::class,
    'show'
]);

Route::get('/products/{product}/reviews', [
    ProductReviewController::class,
    'index'
]);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED USER ROUTE
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| AUTHENTICATED ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [
        AuthController::class,
        'profile'
    ]);

    Route::patch('/profile', [
        AuthController::class,
        'updateProfile'
    ]);

    Route::patch('/profile/password', [
        AuthController::class,
        'changePassword'
    ]);

    /*
    |--------------------------------------------------------------------------
    | ADDRESSES
    |--------------------------------------------------------------------------
    */

    Route::get('/addresses', [
        AddressController::class,
        'index'
    ]);

    Route::post('/addresses', [
        AddressController::class,
        'store'
    ]);

    Route::put('/addresses/{address}', [
        AddressController::class,
        'update'
    ]);

    Route::delete('/addresses/{address}', [
        AddressController::class,
        'destroy'
    ]);

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [
        AuthController::class,
        'logout'
    ]);

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */

    Route::get('/notifications', [
        NotificationController::class,
        'index'
    ]);

    Route::patch('/notifications/{notification}/read', [
        NotificationController::class,
        'markRead'
    ]);

    Route::patch('/notifications/read-all', [
        NotificationController::class,
        'markAllRead'
    ]);

    /*
    |--------------------------------------------------------------------------
    | WISHLIST
    |--------------------------------------------------------------------------
    */

    Route::get('/wishlist', [
        WishlistController::class,
        'index'
    ]);

    Route::post('/wishlist', [
        WishlistController::class,
        'store'
    ]);

    Route::delete('/wishlist/{wishlistItem}', [
        WishlistController::class,
        'destroy'
    ]);

    /*
    |--------------------------------------------------------------------------
    | CART
    |--------------------------------------------------------------------------
    */

    Route::get('/cart', [
        CartController::class,
        'index'
    ]);

    Route::post('/cart', [
        CartController::class,
        'store'
    ]);

    Route::patch('/cart/{cartItem}', [
        CartController::class,
        'update'
    ]);

    Route::delete('/cart/{cartItem}', [
        CartController::class,
        'destroy'
    ]);

    Route::delete('/cart', [
        CartController::class,
        'clear'
    ]);

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER ORDERS
    |--------------------------------------------------------------------------
    */

    Route::get('/orders', [
        OrderController::class,
        'index'
    ]);

    Route::post('/orders', [
        OrderController::class,
        'store'
    ]);

    Route::get('/orders/{order}', [
        OrderController::class,
        'show'
    ]);

    Route::patch('/orders/{order}/cancel', [
        OrderController::class,
        'cancel'
    ]);

    Route::get('/orders/{order}/tracking', [
        OrderController::class,
        'tracking'
    ]);

    /*
    |--------------------------------------------------------------------------
    | PAYMENT
    |--------------------------------------------------------------------------
    */

    Route::post('/orders/{order}/payment/initiate', [
        DemoPaymentController::class,
        'initiate'
    ]);

    Route::post('/orders/{order}/payment/complete', [
        DemoPaymentController::class,
        'complete'
    ]);

    /*
    |--------------------------------------------------------------------------
    | PRODUCT REVIEWS
    |--------------------------------------------------------------------------
    */

    Route::post('/products/{product}/reviews', [
        ProductReviewController::class,
        'store'
    ]);

    Route::delete('/products/{product}/reviews/{review}', [
        ProductReviewController::class,
        'destroy'
    ]);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ORDER MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::get('/admin/orders', [
        OrderController::class,
        'adminIndex'
    ]);

    Route::patch('/admin/orders/{order}/status', [
        OrderController::class,
        'updateStatus'
    ]);

    Route::patch('/admin/orders/{order}/shipping', [
        OrderController::class,
        'updateShipping'
    ]);

    /*
    |--------------------------------------------------------------------------
    | ADMIN USER MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::get('/admin/users', [
        AdminUserController::class,
        'index'
    ]);

    Route::patch('/admin/users/{user}/status', [
        AdminUserController::class,
        'updateStatus'
    ]);

    /*
    |--------------------------------------------------------------------------
    | ADMIN REPORTS
    |--------------------------------------------------------------------------
    */

    Route::get('/admin/reports/summary', [
        ReportController::class,
        'adminSummary'
    ]);

    /*
    |--------------------------------------------------------------------------
    | SELLER PRODUCTS
    |--------------------------------------------------------------------------
    */

    Route::get('/seller/products', [
        ProductController::class,
        'mine'
    ]);

    Route::post('/products', [
        ProductController::class,
        'store'
    ]);

    Route::put('/products/{product}', [
        ProductController::class,
        'update'
    ]);

    Route::delete('/products/{product}', [
        ProductController::class,
        'destroy'
    ]);

    /*
    |--------------------------------------------------------------------------
    | SELLER ORDER MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::get('/seller/order-items', [
        SellerOrderController::class,
        'index'
    ]);

    Route::patch('/seller/order-items/{orderItem}/fulfillment', [
        SellerOrderController::class,
        'updateStatus'
    ]);

    /*
    |--------------------------------------------------------------------------
    | SELLER REPORTS
    |--------------------------------------------------------------------------
    */

    Route::get('/seller/reports/summary', [
        ReportController::class,
        'sellerSummary'
    ]);

    /*
    |--------------------------------------------------------------------------
    | ADMIN CATEGORY MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::post('/categories', [
        CategoryController::class,
        'store'
    ]);

    Route::put('/categories/{category}', [
        CategoryController::class,
        'update'
    ]);

    Route::delete('/categories/{category}', [
        CategoryController::class,
        'destroy'
    ]);

    /*
    |--------------------------------------------------------------------------
    | ADMIN SUBCATEGORY MANAGEMENT
    |--------------------------------------------------------------------------
    */

    Route::post('/categories/{category}/subcategories', [
        CategoryController::class,
        'storeSubcategory'
    ]);

    Route::delete('/subcategories/{subcategory}', [
        CategoryController::class,
        'destroySubcategory'
    ]);
});

/*
|--------------------------------------------------------------------------
| TEST ROUTE
|--------------------------------------------------------------------------
*/

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});