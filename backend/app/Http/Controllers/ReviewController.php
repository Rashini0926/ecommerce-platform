<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReviewController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET ALL REVIEWS FOR PRODUCT
    |--------------------------------------------------------------------------
    */

    public function index($productId)
    {
        $product = Product::findOrFail($productId);

        $reviews = Review::with([
            'user:id,full_name'
        ])
            ->where('product_id', $product->id)
            ->latest()
            ->get();

        $averageRating = $reviews->count() > 0
            ? round($reviews->avg('rating'), 1)
            : 0;

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => $averageRating,
            'total_reviews' => $reviews->count(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE REVIEW
    |--------------------------------------------------------------------------
    */

    public function store(Request $request, $productId)
    {
        $product = Product::findOrFail($productId);

        $request->validate([
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],

            'comment' => [
                'required',
                'string',
                'min:3',
                'max:1000',
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Check Whether User Already Reviewed Product
        |--------------------------------------------------------------------------
        */

        $existingReview = Review::where(
            'product_id',
            $product->id
        )
            ->where(
                'user_id',
                $request->user()->id
            )
            ->first();


        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this product.'
            ], 422);
        }


        /*
        |--------------------------------------------------------------------------
        | Upload Review Image
        |--------------------------------------------------------------------------
        */

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request
                ->file('image')
                ->store(
                    'reviews',
                    'public'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Save Review
        |--------------------------------------------------------------------------
        */

        $review = Review::create([
            'product_id' => $product->id,

            'user_id' => $request->user()->id,

            'rating' => $request->rating,

            'comment' => $request->comment,

            'image' => $imagePath,
        ]);


        /*
        |--------------------------------------------------------------------------
        | Load Reviewer Details
        |--------------------------------------------------------------------------
        */

        $review->load([
            'user:id,full_name'
        ]);


        return response()->json([
            'message' => 'Review added successfully.',

            'review' => $review,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE REVIEW
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);


        /*
        |--------------------------------------------------------------------------
        | Only Review Owner Can Edit
        |--------------------------------------------------------------------------
        */

        if (
            (int) $review->user_id !==
            (int) $request->user()->id
        ) {
            return response()->json([
                'message' => 'You are not allowed to update this review.'
            ], 403);
        }


        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        $request->validate([
            'rating' => [
                'required',
                'integer',
                'min:1',
                'max:5',
            ],

            'comment' => [
                'required',
                'string',
                'min:3',
                'max:1000',
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Update Image If New Image Is Provided
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('image')) {

            if ($review->image) {
                Storage::disk('public')
                    ->delete($review->image);
            }

            $review->image = $request
                ->file('image')
                ->store(
                    'reviews',
                    'public'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Update Review
        |--------------------------------------------------------------------------
        */

        $review->rating = $request->rating;

        $review->comment = $request->comment;

        $review->save();


        /*
        |--------------------------------------------------------------------------
        | Load Reviewer Details
        |--------------------------------------------------------------------------
        */

        $review->load([
            'user:id,full_name'
        ]);


        return response()->json([
            'message' => 'Review updated successfully.',

            'review' => $review,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE REVIEW
    |--------------------------------------------------------------------------
    */

    public function destroy(Request $request, $id)
    {
        $review = Review::findOrFail($id);


        /*
        |--------------------------------------------------------------------------
        | Only Review Owner Can Delete
        |--------------------------------------------------------------------------
        */

        if (
            (int) $review->user_id !==
            (int) $request->user()->id
        ) {
            return response()->json([
                'message' => 'You are not allowed to delete this review.'
            ], 403);
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Uploaded Image
        |--------------------------------------------------------------------------
        */

        if ($review->image) {
            Storage::disk('public')
                ->delete($review->image);
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Review
        |--------------------------------------------------------------------------
        */

        $review->delete();


        return response()->json([
            'message' => 'Review deleted successfully.'
        ]);
    }
}