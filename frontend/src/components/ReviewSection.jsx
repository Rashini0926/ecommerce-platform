import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ReviewSection.css";

const API_URL = "http://127.0.0.1:8000/api";
const STORAGE_URL = "http://127.0.0.1:8000/storage";

function ReviewSection({ productId }) {
  const { user, token } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | Review Data
  |--------------------------------------------------------------------------
  */

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Review Form
  |--------------------------------------------------------------------------
  */

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [editingReview, setEditingReview] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Eligibility
  |--------------------------------------------------------------------------
  */

  const [checkingEligibility, setCheckingEligibility] =
    useState(false);

  const [hasDeliveredPurchase, setHasDeliveredPurchase] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Loading / Messages
  |--------------------------------------------------------------------------
  */

  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Reviews
  |--------------------------------------------------------------------------
  */

  const fetchReviews = async () => {
    if (!productId) {
      return;
    }

    try {
      setLoadingReviews(true);

      const response = await fetch(
        `${API_URL}/products/${productId}/reviews`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load reviews."
        );
      }

      setReviews(
        Array.isArray(data.reviews)
          ? data.reviews
          : []
      );

      setAverageRating(
        Number(data.average_rating || 0)
      );

      setTotalReviews(
        Number(data.total_reviews || 0)
      );
    } catch (err) {
      console.error(
        "Failed to load reviews:",
        err
      );

      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setLoadingReviews(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Find Delivered Purchase
  |--------------------------------------------------------------------------
  |
  | Uses existing:
  |
  | GET /api/orders
  |
  | A customer can review the product only when the same product appears
  | inside a delivered order.
  |
  */

  const checkReviewEligibility = async () => {
    if (!user || !token || !productId) {
      setHasDeliveredPurchase(false);
      return;
    }

    try {
      setCheckingEligibility(true);

      const response = await fetch(
        `${API_URL}/orders`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to verify purchase history."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Support different order response structures
      |--------------------------------------------------------------------------
      */

      const orders = Array.isArray(data)
        ? data
        : Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data.data)
        ? data.data
        : [];

      const eligible = orders.some((order) => {
        const orderStatus = String(
          order.status ||
            order.order_status ||
            ""
        ).toUpperCase();

        const orderItems = Array.isArray(
          order.order_items
        )
          ? order.order_items
          : Array.isArray(order.items)
          ? order.items
          : [];

        return orderItems.some((item) => {
          const itemProductId =
            item.product_id ??
            item.product?.id;

          const itemStatus = String(
            item.fulfillment_status ||
              item.status ||
              ""
          ).toUpperCase();

          const productMatches =
            Number(itemProductId) ===
            Number(productId);

          const delivered =
            orderStatus === "DELIVERED" ||
            itemStatus === "DELIVERED";

          return productMatches && delivered;
        });
      });

      setHasDeliveredPurchase(eligible);
    } catch (err) {
      console.error(
        "Review eligibility check failed:",
        err
      );

      /*
      |--------------------------------------------------------------------------
      | Safe default
      |--------------------------------------------------------------------------
      |
      | If eligibility cannot be verified, do not enable the form.
      |
      */

      setHasDeliveredPurchase(false);
    } finally {
      setCheckingEligibility(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    checkReviewEligibility();
  }, [
    productId,
    user?.id,
    token,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Revoke Blob URL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }
    };
  }, [imagePreview]);

  /*
  |--------------------------------------------------------------------------
  | Current User Review
  |--------------------------------------------------------------------------
  */

  const ownReview = useMemo(
    () =>
      reviews.find(
        (review) =>
          user &&
          Number(review.user_id) ===
            Number(user.id)
      ),
    [reviews, user]
  );

  /*
  |--------------------------------------------------------------------------
  | Review Form Permission
  |--------------------------------------------------------------------------
  |
  | Existing review owners can still edit their review.
  |
  */

  const canReview =
    Boolean(ownReview) ||
    hasDeliveredPurchase;

  const formDisabled =
    checkingEligibility ||
    (!canReview &&
      !editingReview);

  /*
  |--------------------------------------------------------------------------
  | Reset Unsaved Form When User Is Not Eligible
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      user &&
      token &&
      !checkingEligibility &&
      !canReview &&
      !editingReview
    ) {
      setRating(0);
      setHoverRating(0);
      setComment("");

      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      setImage(null);
      setImagePreview(null);
    }
  }, [
    user,
    token,
    checkingEligibility,
    canReview,
    editingReview,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Image Change
  |--------------------------------------------------------------------------
  */

  const handleImageChange = (
    event
  ) => {
    if (formDisabled) {
      event.target.value = "";
      return;
    }

    const file =
      event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please select a JPG, JPEG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setError(
        "The feedback image must be smaller than 2 MB."
      );

      event.target.value = "";
      return;
    }

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImage(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Form
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setRating(0);
    setHoverRating(0);
    setComment("");

    setImage(null);
    setImagePreview(null);

    setEditingReview(null);

    setError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Review
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    if (!user || !token) {
      setError(
        "Please login before adding a review."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Delivered Purchase Validation
    |--------------------------------------------------------------------------
    */

    if (
      !canReview &&
      !editingReview
    ) {
      setError(
        "You can review this product only after a delivered purchase."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Rating Validation
    |--------------------------------------------------------------------------
    */

    if (
      rating < 1 ||
      rating > 5
    ) {
      setError(
        "Please select a rating from 1 to 5 stars."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Comment Validation
    |--------------------------------------------------------------------------
    */

    if (
      comment.trim().length < 3
    ) {
      setError(
        "Your review must contain at least 3 characters."
      );

      return;
    }

    try {
      setSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "rating",
        String(rating)
      );

      formData.append(
        "comment",
        comment.trim()
      );

      if (image) {
        formData.append(
          "image",
          image
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Create / Update
      |--------------------------------------------------------------------------
      */

      const url =
        editingReview
          ? `${API_URL}/reviews/${editingReview.id}`
          : `${API_URL}/products/${productId}/reviews`;

      const response =
        await fetch(url, {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        });

      const data =
        await response.json();

      if (!response.ok) {
        if (data.errors) {
          const validationMessage =
            Object.values(
              data.errors
            )
              .flat()
              .join(" ");

          throw new Error(
            validationMessage
          );
        }

        throw new Error(
          data.message ||
            "Unable to save review."
        );
      }

      const successMessage =
        editingReview
          ? "Review updated successfully."
          : "Review added successfully.";

      resetForm();

      setSuccess(
        successMessage
      );

      await fetchReviews();

      await checkReviewEligibility();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Edit Review
  |--------------------------------------------------------------------------
  */

  const handleEdit = (
    review
  ) => {
    setError("");
    setSuccess("");

    setEditingReview(review);

    setRating(
      Number(
        review.rating || 0
      )
    );

    setHoverRating(0);

    setComment(
      review.comment || ""
    );

    setImage(null);

    if (review.image) {
      setImagePreview(
        `${STORAGE_URL}/${review.image}`
      );
    } else {
      setImagePreview(null);
    }

    setTimeout(() => {
      document
        .getElementById(
          "review-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Review
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    reviewId
  ) => {
    if (!token) {
      setError(
        "Please login first."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `${API_URL}/reviews/${reviewId}`,
          {
            method:
              "DELETE",

            headers: {
              Accept:
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete review."
        );
      }

      if (
        editingReview &&
        Number(
          editingReview.id
        ) ===
          Number(reviewId)
      ) {
        resetForm();
      }

      setSuccess(
        "Review deleted successfully."
      );

      await fetchReviews();

      await checkReviewEligibility();
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete review."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Display Stars
  |--------------------------------------------------------------------------
  */

  const renderStars = (
    value
  ) => {
    const ratingValue =
      Number(value || 0);

    return [1, 2, 3, 4, 5].map(
      (star) => (
        <span
          key={star}
          className={
            star <=
            ratingValue
              ? "display-star active"
              : "display-star"
          }
        >
          ★
        </span>
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <section className="reviews-section">

      {/* ==============================================================
          HEADER
      ============================================================== */}

      <div className="reviews-header">

        <div>

          <p className="reviews-small-title">
            Customer Feedback
          </p>

          <h2>
            Product Reviews
          </h2>

          <p className="reviews-description">
            Read customer experiences or share feedback
            about this product.
          </p>

        </div>

        <div className="rating-summary">

          <div className="average-number">
            {Number(
              averageRating
            ).toFixed(1)}
          </div>

          <div className="summary-stars">

            {renderStars(
              Math.round(
                Number(
                  averageRating
                )
              )
            )}

          </div>

          <div className="total-reviews">

            {totalReviews}{" "}

            {totalReviews === 1
              ? "review"
              : "reviews"}

          </div>

        </div>

      </div>

      {/* ==============================================================
          SUCCESS MESSAGE
      ============================================================== */}

      {success && (
        <div className="review-message success">
          {success}
        </div>
      )}

      {/* ==============================================================
          ERROR MESSAGE
      ============================================================== */}

      {error && (
        <div className="review-message error">
          {error}
        </div>
      )}

      {/* ==============================================================
          PURCHASE ELIGIBILITY MESSAGE
      ============================================================== */}

      {user &&
        token &&
        !checkingEligibility &&
        !canReview &&
        !ownReview && (
          <div className="review-message eligibility-warning">
            You can review this product only after a delivered purchase.
          </div>
        )}

      {/* ==============================================================
          REVIEW AREA
      ============================================================== */}

      {user && token ? (
        <div
          id="review-form"
          className={`review-form-card ${
            formDisabled
              ? "review-form-disabled"
              : ""
          }`}
        >

          {/* ============================================================
              FORM HEADER
          ============================================================ */}

          <div className="review-form-heading">

            <div>

              <h3>
                {editingReview
                  ? "Edit Your Review"
                  : "Write a Review"}
              </h3>

              <p>
                {formDisabled
                  ? "A delivered purchase is required before leaving a review."
                  : "Share an experience with other customers."}
              </p>

            </div>

            {editingReview && (
              <span className="editing-badge">
                Editing
              </span>
            )}

          </div>

          {/* ============================================================
              CHECKING PURCHASE
          ============================================================ */}

          {checkingEligibility ? (
            <div className="review-eligibility-loading">
              Checking purchase eligibility...
            </div>
          ) : !editingReview &&
            ownReview ? (
            /*
            ==============================================================
            ALREADY REVIEWED
            ==============================================================
            */

            <div className="already-reviewed">

              <div>

                <strong>
                  Review already submitted
                </strong>

                <p>
                  Only one review can be added for each
                  product. The existing review can be
                  edited or deleted below.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  handleEdit(
                    ownReview
                  )
                }
              >
                Edit My Review
              </button>

            </div>
          ) : (
            /*
            ==============================================================
            REVIEW FORM
            ==============================================================
            */

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* ========================================================
                  RATING
              ======================================================== */}

              <div className="review-form-group">

                <label>
                  Your Rating *
                </label>

                <div className="interactive-stars">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        disabled={
                          formDisabled ||
                          submitting
                        }
                        className={
                          star <=
                          (
                            hoverRating ||
                            rating
                          )
                            ? "rating-star active"
                            : "rating-star"
                        }
                        onClick={() => {
                          if (
                            !formDisabled
                          ) {
                            setRating(
                              star
                            );
                          }
                        }}
                        onMouseEnter={() => {
                          if (
                            !formDisabled
                          ) {
                            setHoverRating(
                              star
                            );
                          }
                        }}
                        onMouseLeave={() => {
                          if (
                            !formDisabled
                          ) {
                            setHoverRating(
                              0
                            );
                          }
                        }}
                        aria-label={`${star} star rating`}
                      >
                        ★
                      </button>
                    )
                  )}

                  <span className="selected-rating-text">
                    {rating > 0
                      ? `${rating} / 5`
                      : formDisabled
                      ? "Unavailable"
                      : "Select rating"}
                  </span>

                </div>

              </div>

              {/* ========================================================
                  COMMENT
              ======================================================== */}

              <div className="review-form-group">

                <label htmlFor="review-comment">
                  Your Review *
                </label>

                <textarea
                  id="review-comment"
                  value={comment}
                  disabled={
                    formDisabled ||
                    submitting
                  }
                  onChange={(event) =>
                    setComment(
                      event.target.value
                    )
                  }
                  maxLength={1000}
                  rows={5}
                  placeholder={
                    formDisabled
                      ? "Review available after a delivered purchase."
                      : "What did you like about this product? Share your experience..."
                  }
                  required
                />

                <div className="review-character-count">
                  {comment.length}/1000
                </div>

              </div>

              {/* ========================================================
                  IMAGE
              ======================================================== */}

              <div className="review-form-group">

                <label>
                  Feedback Image

                  <span className="optional-text">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <div
                  className={`review-upload-area ${
                    formDisabled
                      ? "disabled"
                      : ""
                  }`}
                >

                  <input
                    id="review-image"
                    type="file"
                    disabled={
                      formDisabled ||
                      submitting
                    }
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                  />

                  <label
                    htmlFor={
                      formDisabled
                        ? undefined
                        : "review-image"
                    }
                    className={`review-upload-button ${
                      formDisabled
                        ? "disabled"
                        : ""
                    }`}
                  >

                    <span className="upload-icon">
                      📷
                    </span>

                    <span>

                      <strong>
                        {formDisabled
                          ? "Image Upload Disabled"
                          : "Choose Image"}
                      </strong>

                      <small>
                        {formDisabled
                          ? "Available after a delivered purchase"
                          : "JPG, JPEG, PNG or WEBP — max 2 MB"}
                      </small>

                    </span>

                  </label>

                </div>

                {imagePreview && (
                  <div className="review-preview-wrapper">

                    <img
                      src={
                        imagePreview
                      }
                      alt="Review feedback preview"
                      className="review-preview-image"
                    />

                    <button
                      type="button"
                      className="remove-preview-button"
                      disabled={
                        formDisabled ||
                        submitting
                      }
                      onClick={() => {
                        if (
                          imagePreview.startsWith(
                            "blob:"
                          )
                        ) {
                          URL.revokeObjectURL(
                            imagePreview
                          );
                        }

                        setImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </button>

                  </div>
                )}

              </div>

              {/* ========================================================
                  ACTIONS
              ======================================================== */}

              <div className="review-form-actions">

                {editingReview && (
                  <button
                    type="button"
                    className="cancel-review-button"
                    onClick={
                      resetForm
                    }
                    disabled={
                      submitting
                    }
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="submit-review-button"
                  disabled={
                    submitting ||
                    formDisabled
                  }
                >
                  {submitting
                    ? "Saving..."
                    : formDisabled
                    ? "Delivered Purchase Required"
                    : editingReview
                    ? "Update Review"
                    : "Submit Review"}
                </button>

              </div>

            </form>
          )}

        </div>
      ) : (
        /*
        ==================================================================
        LOGIN REQUIRED
        ==================================================================
        */

        <div className="review-login-card">

          <div className="review-login-icon">
            ★
          </div>

          <div>

            <h3>
              Want to leave a review?
            </h3>

            <p>
              Login to rate this product, write a review
              and upload a feedback image after a delivered
              purchase.
            </p>

          </div>

          <Link to="/login">
            Login to Review
          </Link>

        </div>
      )}

      {/* ==============================================================
          CUSTOMER REVIEWS
      ============================================================== */}

      <div className="reviews-list-section">

        <div className="reviews-list-heading">

          <h3>
            Customer Reviews
          </h3>

          <span>

            {totalReviews}{" "}

            {totalReviews === 1
              ? "review"
              : "reviews"}

          </span>

        </div>

        {loadingReviews ? (
          <div className="reviews-empty-state">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty-state">

            <div className="empty-review-star">
              ☆
            </div>

            <h4>
              No reviews yet
            </h4>

            <p>
              Reviews will appear here after verified
              customers submit feedback.
            </p>

          </div>
        ) : (
          <div className="review-cards">

            {reviews.map(
              (review) => {
                const isOwner =
                  user &&
                  Number(
                    user.id
                  ) ===
                    Number(
                      review.user_id
                    );

                return (
                  <article
                    className="customer-review-card"
                    key={
                      review.id
                    }
                  >

                    <div className="review-card-header">

                      <div className="review-user-info">

                        <div className="review-avatar">
                          {review.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            review.user?.full_name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                            "U"}
                        </div>

                        <div>

                          <h4>
                            {review.user?.name ||
                              review.user
                                ?.full_name ||
                              "Customer"}
                          </h4>

                          <div className="review-date">

                            {review.created_at
                              ? new Date(
                                  review.created_at
                                ).toLocaleDateString(
                                  undefined,
                                  {
                                    year:
                                      "numeric",

                                    month:
                                      "short",

                                    day:
                                      "numeric",
                                  }
                                )
                              : ""}

                          </div>

                        </div>

                      </div>

                      <div className="review-card-rating">

                        {renderStars(
                          review.rating
                        )}

                      </div>

                    </div>

                    <p className="review-comment">
                      {review.comment}
                    </p>

                    {review.image && (
                      <div className="customer-review-image-wrapper">

                        <img
                          src={`${STORAGE_URL}/${review.image}`}
                          alt="Customer product feedback"
                          className="customer-review-image"
                        />

                      </div>
                    )}

                    {isOwner && (
                      <div className="review-owner-actions">

                        <button
                          type="button"
                          className="edit-review-button"
                          onClick={() =>
                            handleEdit(
                              review
                            )
                          }
                        >
                          ✎ Edit
                        </button>

                        <button
                          type="button"
                          className="delete-review-button"
                          onClick={() =>
                            handleDelete(
                              review.id
                            )
                          }
                        >
                          🗑 Delete
                        </button>

                      </div>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
}

export default ReviewSection;