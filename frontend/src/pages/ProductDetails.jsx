import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCartPlus,
  FaHeart,
  FaMinus,
  FaPlus,
  FaRegStar,
  FaStar,
  FaTruck,
} from "react-icons/fa";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { addToCart, addToWishlist } from "../services/customerService";
import { getProduct } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);

      try {
        const response = await getProduct(id);
        setProduct(response);
      } catch (error) {
        showToast(
          error.response?.data?.message || "Failed to load product details.",
          "danger"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, showToast]);

  const handleAddToCart = async () => {
    if (!token) {
      showToast("Please login before adding products.", "info");
      return;
    }

    setIsProcessing(true);

    try {
      await addToCart(token, product.id, quantity);
      showToast("Product added to cart.", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to add product to cart.",
        "danger"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!token) {
      showToast("Please login before adding products.", "info");
      return;
    }

    setIsProcessing(true);

    try {
      await addToWishlist(token, product.id);
      showToast("Product added to wishlist.", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to add product to wishlist.",
        "danger"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <Link to="/products" className="btn btn-outline-secondary mb-4">
          <FaArrowLeft className="me-2" />
          Back to Products
        </Link>

        {isLoading ? (
          <div className="card glass-card empty-state">
            <LoadingSpinner text="Loading product" />
          </div>
        ) : !product ? (
          <div className="card glass-card empty-state">
            <h4>Product not found.</h4>
            <p className="text-muted">
              The product may have been removed or is currently unavailable.
            </p>
          </div>
        ) : (
          <>
            <div className="row g-4 align-items-start">
              <div className="col-lg-5">
                <div className="card glass-card product-detail-media">
                  <img
                    src={product.image || "https://via.placeholder.com/700x700?text=Product"}
                    alt={product.name}
                  />
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card glass-card">
                  <div className="card-body p-4 p-lg-5">
                    <span className="badge badge-soft-accent mb-3">
                      {product.category?.name || "Product"}
                    </span>

                    <h1 className="h2 mb-3">{product.name}</h1>

                    <div className="product-rating mb-3">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaRegStar />
                      <span>{Number(product.rating || 0).toFixed(1)}</span>
                    </div>

                    <h2 className="text-primary mb-4">
                      Rs. {Number(product.price || 0).toLocaleString()}
                    </h2>

                    <p className="text-muted">
                      {product.description || "Product description is not available yet."}
                    </p>

                    <div className="row g-3 my-4">
                      <div className="col-sm-6">
                        <div className="info-row h-100">
                          <strong>Brand</strong>
                          <p className="text-muted mb-0">{product.brand || "Not specified"}</p>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="info-row h-100">
                          <strong>Stock</strong>
                          <p className="text-muted mb-0">
                            {Number(product.stock) > 0
                              ? `${product.stock} available`
                              : "Out of stock"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                      <div className="quantity-control">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                        >
                          <FaMinus />
                        </button>

                        <span className="fw-bold px-2">{quantity}</span>

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          aria-label="Increase quantity"
                          onClick={() => setQuantity((current) => current + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <span className="badge badge-soft-success">
                        <FaTruck className="me-2" />
                        Delivery calculated at checkout
                      </span>
                    </div>

                    <div className="d-grid d-sm-flex gap-3">
                      <button
                        className="btn btn-primary ripple flex-fill"
                        disabled={isProcessing || Number(product.stock) <= 0}
                        onClick={handleAddToCart}
                      >
                        <FaCartPlus className="me-2" />
                        Add to Cart
                      </button>

                      <button
                        className="btn btn-outline-danger flex-fill"
                        disabled={isProcessing}
                        onClick={handleAddToWishlist}
                      >
                        <FaHeart className="me-2" />
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="card glass-card mt-4">
              <div className="card-body p-4">
                <span className="section-kicker">Product information</span>
                <h4 className="mt-2 mb-3">Specifications</h4>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="info-row h-100">
                      <strong>Subcategory</strong>
                      <p className="text-muted mb-0">
                        {product.subcategory?.name || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="info-row h-100">
                      <strong>Color</strong>
                      <p className="text-muted mb-0">{product.color || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="info-row h-100">
                      <strong>Size</strong>
                      <p className="text-muted mb-0">{product.size || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
