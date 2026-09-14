import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheck,
  FaHeart,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaTruck,
} from "react-icons/fa";
import "./ProductDetails.css";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  addToCart,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/customerService";
import { getProduct } from "../services/productService";
import api from "../utils/api";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const userRole = user?.role;
  const userId = user?.id;

  const [productResult, setProductResult] = useState({ id: null, product: null });
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [reviewResult, setReviewResult] = useState({ productId: null, items: [] });
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [wishlistOwnerId, setWishlistOwnerId] = useState(null);
  const [wishlistProductId, setWishlistProductId] = useState(null);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getProduct(id)
      .then((data) => {
        if (!cancelled) {
          setProductResult({ id, product: data });
          setQuantity(1);
          setAdded(false);
        }
      })
      .catch((error) => {
        console.error("Failed to load product:", error);
        if (!cancelled) setProductResult({ id, product: null });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    api.get(`/products/${id}/reviews`)
      .then((response) => {
        if (!cancelled) {
          setReviewResult({ productId: id, items: response.data.data || [] });
        }
      })
      .catch((error) => {
        console.error("Failed to load reviews:", error);
        if (!cancelled) setReviewResult({ productId: id, items: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    if (!token || userRole !== "customer") {
      return () => {
        cancelled = true;
      };
    }

    getWishlist(token)
      .then((response) => {
        if (cancelled) return;

        const savedItem = (response.items || []).find(
          (item) => String(item.product_id) === String(id)
        );

        setWishlistItemId(savedItem?.id || null);
        setWishlistOwnerId(userId);
        setWishlistProductId(id);
      })
      .catch((error) => {
        if (!cancelled) console.error("Wishlist loading error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [id, token, userId, userRole]);

  const hasLoadedProduct = String(productResult.id) === String(id);
  const product = hasLoadedProduct ? productResult.product : null;
  const loading = !hasLoadedProduct;
  const reviewsLoaded = String(reviewResult.productId) === String(id);
  const reviews = reviewsLoaded ? reviewResult.items : [];
  const stockCount = Number(product?.stock || 0);
  const salePrice = Number(product?.sale_price ?? product?.price ?? 0);
  const originalPrice = Number(product?.price || 0);
  const discount = Number(product?.discount_percentage || 0);
  const activeWishlistItemId = wishlistOwnerId === userId &&
    String(wishlistProductId) === String(id)
    ? wishlistItemId
    : null;

  const placeholderImage = `${import.meta.env.BASE_URL}images/products/placeholder.svg`;

  const getImageSrc = (image) => {
    if (!image) return placeholderImage;
    return image.startsWith("http")
      ? image
      : `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
  };

  const handleAddToCart = async () => {
    if (!token) {
      showToast("Please log in as a customer to add products to your cart.", "info");
      navigate("/login");
      return;
    }

    if (userRole !== "customer") {
      showToast("Only customer accounts can use the shopping cart.", "warning");
      return;
    }

    setIsAdding(true);

    try {
      await addToCart(token, product.id, quantity);
      setAdded(true);
      showToast("Product added to cart.", "success");
      window.setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      showToast(
        error.response?.data?.errors?.quantity?.[0] ||
          error.response?.data?.message ||
          "Unable to add product to cart.",
        "danger"
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!token) {
      showToast("Please log in to save products to your wishlist.", "info");
      navigate("/login");
      return;
    }

    if (userRole !== "customer") {
      showToast("Only customer accounts can use the wishlist.", "warning");
      return;
    }

    setIsUpdatingWishlist(true);

    try {
      if (activeWishlistItemId) {
        await removeFromWishlist(token, activeWishlistItemId);
        setWishlistItemId(null);
        showToast("Product removed from wishlist.", "info");
      } else {
        const response = await addToWishlist(token, product.id);
        setWishlistItemId(response.item.id);
        setWishlistOwnerId(userId);
        setWishlistProductId(product.id);
        showToast("Product added to wishlist.", "success");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Unable to update your wishlist.",
        "danger"
      );
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const response = await api.post(`/products/${id}/reviews`, review, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviewResult((current) => ({
        productId: id,
        items: [
          response.data.review,
          ...(String(current.productId) === String(id) ? current.items : [])
            .filter((item) => item.user_id !== response.data.review.user_id),
        ],
      }));
      setReview({ rating: 5, comment: "" });
      showToast("Review saved successfully.", "success");
    } catch (error) {
      showToast(
        error.response?.data?.errors?.product?.[0] ||
          error.response?.data?.errors?.comment?.[0] ||
          error.response?.data?.message ||
          "Unable to save review.",
        "danger"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="app-page product-detail-page">
        <Navbar />
        <main className="container product-detail-main">
          <div className="product-detail-state" role="status">
            <LoadingSpinner size="lg" text="Loading product details..." />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-page product-detail-page">
        <Navbar />
        <main className="container product-detail-main">
          <div className="product-detail-state">
            <FaBoxOpen aria-hidden="true" />
            <h1>Product not found</h1>
            <p>This product may have been removed or is no longer available.</p>
            <Link to="/products" className="btn btn-primary rounded-pill px-4">
              <FaArrowLeft className="me-2" />
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-page product-detail-page">
      <Navbar />

      <main className="container product-detail-main">
        <nav className="product-breadcrumb" aria-label="Product breadcrumb">
          <Link to="/products">
            <FaArrowLeft />
            Back to Products
          </Link>
          <span>/</span>
          <span>{product.category?.name || "Product"}</span>
        </nav>

        <section className="row g-4 g-xl-5 align-items-start">
          <div className="col-12 col-lg-5">
            <div className="product-gallery-card">
              {discount > 0 && (
                <span className="product-discount-badge">
                  -{discount.toLocaleString("en-LK", { maximumFractionDigits: 2 })}%
                </span>
              )}
              <img
                className="product-detail-image"
                src={getImageSrc(product.image)}
                alt={product.name}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = placeholderImage;
                }}
              />
              <span className={`product-stock-pill ${stockCount > 0 ? "is-available" : "is-sold-out"}`}>
                {stockCount > 0 ? `${stockCount} available` : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <article className="product-info-card">
              <div className="product-meta-line">
                <span>{product.brand || "ShopEase"}</span>
                <span>{product.category?.name || "General"}</span>
              </div>

              <h1>{product.name}</h1>

              <div className="product-rating-row">
                <span className="product-rating-badge">
                  <FaStar />
                  {Number(product.rating || 0).toFixed(1)}
                </span>
                <span>{reviews.length} customer review{reviews.length === 1 ? "" : "s"}</span>
                {product.seller?.full_name && <span>Sold by {product.seller.full_name}</span>}
              </div>

              <div className="product-price-row">
                <span className="product-current-price">LKR {formatPrice(salePrice)}</span>
                {discount > 0 && (
                  <span className="product-original-price">LKR {formatPrice(originalPrice)}</span>
                )}
              </div>

              <p className="product-detail-description">
                {product.description || "A quality product selected for the ShopEase marketplace."}
              </p>

              <dl className="product-specifications">
                <div><dt>Category</dt><dd>{product.category?.name || "Not specified"}</dd></div>
                <div><dt>Subcategory</dt><dd>{product.subcategory?.name || "Not specified"}</dd></div>
                <div><dt>Brand</dt><dd>{product.brand || "Not specified"}</dd></div>
                <div><dt>Color</dt><dd>{product.color || "Not specified"}</dd></div>
                <div><dt>Size</dt><dd>{product.size || "Not specified"}</dd></div>
                <div><dt>Availability</dt><dd>{stockCount > 0 ? "In stock" : "Unavailable"}</dd></div>
              </dl>

              <div className="product-purchase-panel">
                <div className="product-quantity-selector" aria-label="Product quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    disabled={quantity <= 1 || stockCount < 1}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.min(stockCount, current + 1))}
                    disabled={quantity >= stockCount || stockCount < 1}
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>

                <button
                  type="button"
                  className={`product-cart-button ${added ? "is-added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={isAdding || stockCount < 1}
                >
                  {added ? <FaCheck /> : <FaShoppingCart />}
                  {isAdding
                    ? "Adding..."
                    : added
                      ? "Added to Cart"
                      : stockCount < 1
                        ? "Out of Stock"
                        : "Add to Cart"}
                </button>
              </div>

              <button
                type="button"
                className={`product-wishlist-button ${activeWishlistItemId ? "is-saved" : ""}`}
                onClick={handleWishlist}
                disabled={isUpdatingWishlist}
                aria-pressed={Boolean(activeWishlistItemId)}
              >
                {activeWishlistItemId ? <FaHeart /> : <FaRegHeart />}
                {isUpdatingWishlist
                  ? "Updating wishlist..."
                  : activeWishlistItemId
                    ? "Saved to Wishlist"
                    : "Add to Wishlist"}
              </button>

              <div className="product-trust-row">
                <span><FaShieldAlt />Secure checkout</span>
                <span><FaTruck />Islandwide delivery</span>
              </div>
            </article>
          </div>
        </section>

        <section className="product-reviews-section" aria-labelledby="reviews-heading">
          <div className="product-reviews-header">
            <div>
              <span className="section-kicker">Verified feedback</span>
              <h2 id="reviews-heading">Customer Reviews</h2>
            </div>
            <span className="review-count-badge">{reviews.length} reviews</span>
          </div>

          {userRole === "customer" && (
            <form className="product-review-form" onSubmit={submitReview}>
              <div>
                <label htmlFor="review-rating">Your rating</label>
                <select
                  id="review-rating"
                  value={review.rating}
                  onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating} stars</option>
                  ))}
                </select>
              </div>
              <div className="review-comment-field">
                <label htmlFor="review-comment">Your experience</label>
                <textarea
                  id="review-comment"
                  rows="3"
                  maxLength="2000"
                  value={review.comment}
                  onChange={(event) => setReview({ ...review, comment: event.target.value })}
                  placeholder="Share what you liked about this product (optional)"
                />
              </div>
              <button type="submit" disabled={isSubmittingReview}>
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {!reviewsLoaded ? (
            <div className="product-reviews-empty">
              <LoadingSpinner text="Loading reviews..." />
            </div>
          ) : reviews.length === 0 ? (
            <div className="product-reviews-empty">
              <FaStar />
              <h3>No reviews yet</h3>
              <p>Be the first verified customer to review this product.</p>
            </div>
          ) : (
            <div className="product-review-list">
              {reviews.map((item) => (
                <article className="product-review-card" key={item.id}>
                  <div className="review-card-heading">
                    <div className="review-avatar" aria-hidden="true">
                      {(item.user?.full_name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{item.user?.full_name || "Customer"}</h3>
                      <span>Verified purchase</span>
                    </div>
                    <div className="review-stars" aria-label={`${item.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <FaStar key={index} className={index < item.rating ? "is-filled" : ""} />
                      ))}
                    </div>
                  </div>
                  <p>{item.comment || "No written comment was provided."}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
