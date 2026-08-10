import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaCartPlus,
  FaFilter,
  FaHeart,
  FaRegStar,
  FaSearch,
  FaSlidersH,
  FaStar,
} from "react-icons/fa";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { addToCart, addToWishlist } from "../services/customerService";
import { getCategories, getProducts } from "../services/productService";

const priceRanges = [
  { label: "All prices", min: "", max: "" },
  { label: "Under Rs. 5,000", min: "", max: 5000 },
  { label: "Rs. 5,000 - Rs. 10,000", min: 5000, max: 10000 },
  { label: "Above Rs. 10,000", min: 10000, max: "" },
];

function formatPrice(price) {
  return `Rs. ${Number(price || 0).toLocaleString("en-LK")}`;
}

function Products() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All prices");
  const [sortOrder, setSortOrder] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [processingProductId, setProcessingProductId] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response || []);
      } catch (error) {
        showToast(
          error.response?.data?.message || "Failed to load categories.",
          "danger"
        );
      }
    };

    loadCategories();
  }, [showToast]);

  useEffect(() => {
    const loadProducts = async () => {
      const activePriceRange =
        priceRanges.find((range) => range.label === selectedPriceRange) ||
        priceRanges[0];

      setIsLoading(true);

      try {
        const response = await getProducts({
          search: searchTerm || undefined,
          category_id: selectedCategory || undefined,
          min_price: activePriceRange.min || undefined,
          max_price: activePriceRange.max || undefined,
        });

        setProducts(response || []);
      } catch (error) {
        showToast(
          error.response?.data?.message || "Failed to load products.",
          "danger"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [searchTerm, selectedCategory, selectedPriceRange, showToast]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((firstProduct, secondProduct) => {
      if (sortOrder === "price-low") {
        return Number(firstProduct.price) - Number(secondProduct.price);
      }

      if (sortOrder === "price-high") {
        return Number(secondProduct.price) - Number(firstProduct.price);
      }

      if (sortOrder === "rating") {
        return Number(secondProduct.rating) - Number(firstProduct.rating);
      }

      return firstProduct.id - secondProduct.id;
    });
  }, [products, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm) {
      setSearchParams({ search: trimmedSearchTerm });
      setSearchTerm(trimmedSearchTerm);
    } else {
      setSearchParams({});
      setSearchTerm("");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedPriceRange("All prices");
    setSortOrder("featured");
    setSearchParams({});
  };

  const handleCustomerAction = async (productId, action) => {
    if (!token) {
      showToast("Please login before adding products.", "info");
      return;
    }

    setProcessingProductId(productId);

    try {
      if (action === "wishlist") {
        await addToWishlist(token, productId);
        showToast("Product added to wishlist.", "success");
      } else {
        await addToCart(token, productId, 1);
        showToast("Product added to cart.", "success");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Action failed. Please try again.",
        "danger"
      );
    } finally {
      setProcessingProductId(null);
    }
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <div className="products-header mb-4">
          <div>
            <span className="section-kicker">Browse products</span>
            <h1 className="mt-2 mb-2">Find Your Next Favorite Item</h1>
            <p className="text-muted mb-0">
              Search products, compare prices, and filter by shopping category.
            </p>
          </div>

          <span className="badge badge-soft-primary">
            {sortedProducts.length} products found
          </span>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <aside className="card glass-card product-filter-panel">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="mb-0">
                    <FaSlidersH className="me-2 text-primary" />
                    Filters
                  </h5>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                </div>

                <form onSubmit={handleSearchSubmit}>
                  <label className="form-label fw-bold">Search</label>
                  <div className="input-group mb-4">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>

                    <input
                      type="search"
                      className="form-control"
                      placeholder="Product name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-4">
                    <FaFilter className="me-2" />
                    Apply Search
                  </button>
                </form>

                <label className="form-label fw-bold">Category</label>
                <select
                  className="form-select mb-4"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <label className="form-label fw-bold">Price Range</label>
                <select
                  className="form-select"
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                >
                  {priceRanges.map((range) => (
                    <option value={range.label} key={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </aside>
          </div>

          <div className="col-lg-9">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <p className="text-muted mb-0">
                Showing {sortedProducts.length} products
              </p>

              <select
                className="form-select product-sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Sort by featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Highest rated</option>
              </select>
            </div>

            {isLoading ? (
              <div className="card glass-card empty-state">
                <LoadingSpinner text="Loading products" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="card glass-card empty-state">
                <div className="empty-illustration mb-4">
                  <FaSearch size={42} />
                </div>

                <h4>No products found.</h4>
                <p className="text-muted">
                  Try changing your search keyword, category, or price range.
                </p>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {sortedProducts.map((product) => (
                  <div className="col-md-6 col-xl-4" key={product.id}>
                    <div className="card product-card hover-lift card-hover-shadow h-100">
                      <div className="product-image-wrap">
                        <img
                          src={product.image || "https://via.placeholder.com/700x500?text=Product"}
                          className="product-image"
                          alt={product.name}
                        />
                      </div>

                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                          <span className="badge badge-soft-accent">
                            {Number(product.stock) > 0 ? "Available" : "Out of stock"}
                          </span>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger product-icon-button"
                            aria-label={`Add ${product.name} to wishlist`}
                            disabled={processingProductId === product.id}
                            onClick={() => handleCustomerAction(product.id, "wishlist")}
                          >
                            <FaHeart />
                          </button>
                        </div>

                        <p className="text-muted small fw-bold mb-1">
                          {product.category?.name || "Product"}
                        </p>

                        <h5 className="product-title">{product.name}</h5>

                        <div className="product-rating mb-2">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                          <span>
                            {Number(product.rating || 0).toFixed(1)}
                          </span>
                        </div>

                        <p className="text-primary fw-bold fs-5 mb-4">
                          {formatPrice(product.price)}
                        </p>

                        <div className="d-grid gap-2 mt-auto">
                          <button
                            className="btn btn-primary ripple"
                            disabled={processingProductId === product.id}
                            onClick={() => handleCustomerAction(product.id, "cart")}
                          >
                            <FaCartPlus className="me-2" />
                            Add to Cart
                          </button>

                          <Link
                            className="btn btn-outline-primary"
                            to={`/products/${product.id}`}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Products;
