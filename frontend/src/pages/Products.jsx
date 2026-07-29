import { useMemo, useState } from "react";
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
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 8500,
    rating: 4.8,
    reviews: 128,
    tag: "Best seller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 12000,
    rating: 4.6,
    reviews: 92,
    tag: "New arrival",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Laptop Backpack",
    category: "Fashion",
    price: 4500,
    rating: 4.4,
    reviews: 74,
    tag: "Top rated",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 6000,
    rating: 4.5,
    reviews: 88,
    tag: "Flash deal",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    name: "Cotton Casual Shirt",
    category: "Fashion",
    price: 3200,
    rating: 4.3,
    reviews: 56,
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    name: "Ceramic Dinner Set",
    category: "Home & Living",
    price: 7200,
    rating: 4.7,
    reviews: 61,
    tag: "Limited stock",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    name: "Skincare Gift Box",
    category: "Beauty",
    price: 5600,
    rating: 4.5,
    reviews: 43,
    tag: "Gift pick",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    name: "Fitness Yoga Mat",
    category: "Sports",
    price: 2800,
    rating: 4.2,
    reviews: 39,
    tag: "Value deal",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=700&q=80",
  },
];

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Sports",
];

const priceRanges = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under Rs. 5,000", min: 0, max: 5000 },
  { label: "Rs. 5,000 - Rs. 10,000", min: 5000, max: 10000 },
  { label: "Above Rs. 10,000", min: 10000, max: Infinity },
];

function formatPrice(price) {
  return `Rs. ${price.toLocaleString("en-LK")}`;
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All prices");
  const [sortOrder, setSortOrder] = useState("featured");

  const filteredProducts = useMemo(() => {
    const activePriceRange =
      priceRanges.find((range) => range.label === selectedPriceRange) ||
      priceRanges[0];

    const filteredItems = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= activePriceRange.min &&
        product.price <= activePriceRange.max;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    return [...filteredItems].sort((firstProduct, secondProduct) => {
      if (sortOrder === "price-low") {
        return firstProduct.price - secondProduct.price;
      }

      if (sortOrder === "price-high") {
        return secondProduct.price - firstProduct.price;
      }

      if (sortOrder === "rating") {
        return secondProduct.rating - firstProduct.rating;
      }

      return firstProduct.id - secondProduct.id;
    });
  }, [searchTerm, selectedCategory, selectedPriceRange, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm) {
      setSearchParams({ search: trimmedSearchTerm });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedPriceRange("All prices");
    setSortOrder("featured");
    setSearchParams({});
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
            {filteredProducts.length} products found
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
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
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
                Showing {filteredProducts.length} of {products.length} products
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

            {filteredProducts.length === 0 ? (
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
                {filteredProducts.map((product) => (
                  <div className="col-md-6 col-xl-4" key={product.id}>
                    <div className="card product-card hover-lift card-hover-shadow h-100">
                      <div className="product-image-wrap">
                        <img
                          src={product.image}
                          className="product-image"
                          alt={product.name}
                        />
                      </div>

                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                          <span className="badge badge-soft-accent">
                            {product.tag}
                          </span>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger product-icon-button"
                            aria-label={`Add ${product.name} to wishlist`}
                          >
                            <FaHeart />
                          </button>
                        </div>

                        <p className="text-muted small fw-bold mb-1">
                          {product.category}
                        </p>

                        <h5 className="product-title">{product.name}</h5>

                        <div className="product-rating mb-2">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaRegStar />
                          <span>
                            {product.rating} ({product.reviews})
                          </span>
                        </div>

                        <p className="text-primary fw-bold fs-5 mb-4">
                          {formatPrice(product.price)}
                        </p>

                        <div className="d-grid gap-2 mt-auto">
                          <button className="btn btn-primary ripple">
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
