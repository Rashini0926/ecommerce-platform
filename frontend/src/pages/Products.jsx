import "./Products.css";

import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaStar,
  FaHeart,
  FaBoxOpen,
  FaTag,
  FaPalette,
  FaLayerGroup,
  FaList,
} from "react-icons/fa";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { API_BASE_URL } from "../utils/api";

/*
==========================================================
PRICE FORMATTER
==========================================================

IMPORTANT:

The database "products.price" value is treated directly
as Sri Lankan Rupees.

Example:

Database price = 285000
Display        = Rs. 285,000.00

No USD conversion is performed.
==========================================================
*/

const formatPrice = (amount) => {
  return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

function Products() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  /*
  ==========================================================
  INITIAL URL PARAMETERS
  ==========================================================
  */

  const initialSearch =
    searchParams.get("search") || "";

  const API_URL = API_BASE_URL;

  const initialCategoryId =
    searchParams.get("category_id") || "";

  const initialSubcategoryId =
    searchParams.get("subcategory_id") || "";

  /*
  ==========================================================
  DATA STATES
  ==========================================================
  */

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [
    subcategories,
    setSubcategories,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /*
  ==========================================================
  FILTER STATES
  ==========================================================
  */

  const [search, setSearch] =
    useState(initialSearch);

  const [
    categoryId,
    setCategoryId,
  ] = useState(initialCategoryId);

  const [
    subcategoryId,
    setSubcategoryId,
  ] = useState(initialSubcategoryId);

  const [brand, setBrand] =
    useState("");

  const [color, setColor] =
    useState("");

  const [size, setSize] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [
    minRating,
    setMinRating,
  ] = useState("");

  /*
  ==========================================================
  WISHLIST STATE
  ==========================================================
  */

  const [
    wishlistState,
    setWishlistState,
  ] = useState({});

  /*
  ==========================================================
  FETCH PRODUCTS
  ==========================================================
  */

  const fetchProducts = async (
    customFilters = null
  ) => {
    try {
      setLoading(true);

      const filters =
        customFilters || {
          search,
          categoryId,
          subcategoryId,
          brand,
          color,
          size,
          minPrice,
          maxPrice,
          minRating,
        };

      const params =
        new URLSearchParams();

      if (filters.search) {
        params.append(
          "search",
          filters.search
        );
      }

      if (filters.categoryId) {
        params.append(
          "category_id",
          filters.categoryId
        );
      }

      if (filters.subcategoryId) {
        params.append(
          "subcategory_id",
          filters.subcategoryId
        );
      }

      if (filters.brand) {
        params.append(
          "brand",
          filters.brand
        );
      }

      if (filters.color) {
        params.append(
          "color",
          filters.color
        );
      }

      if (filters.size) {
        params.append(
          "size",
          filters.size
        );
      }

      /*
      PRICE VALUES ARE ALREADY LKR
      */

      if (filters.minPrice) {
        params.append(
          "min_price",
          filters.minPrice
        );
      }

      if (filters.maxPrice) {
        params.append(
          "max_price",
          filters.maxPrice
        );
      }

      if (filters.minRating) {
        params.append(
          "min_rating",
          filters.minRating
        );
      }

      const queryString =
        params.toString();

      const url =
        queryString
          ? `${API_URL}/products?${queryString}`
          : `${API_URL}/products`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Unable to fetch products."
        );
      }

      const data =
        await response.json();

      const productList =
        Array.isArray(data)
          ? data
          : data.products || [];

      setProducts(productList);
    } catch (error) {
      console.error(
        "Product loading error:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================================
  FETCH CATEGORIES
  ==========================================================
  */

  const fetchCategories =
    async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/categories`
          );

        if (!response.ok) {
          throw new Error(
            "Unable to fetch categories."
          );
        }

        const data =
          await response.json();

        setCategories(
          Array.isArray(data)
            ? data
            : data.categories || []
        );
      } catch (error) {
        console.error(
          "Category loading error:",
          error
        );
      }
    };

  /*
  ==========================================================
  FETCH SUBCATEGORIES
  ==========================================================
  */

  const fetchSubcategories =
    async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/subcategories`
          );

        if (!response.ok) {
          throw new Error(
            "Unable to fetch subcategories."
          );
        }

        const data =
          await response.json();

        setSubcategories(
          Array.isArray(data)
            ? data
            : data.subcategories || []
        );
      } catch (error) {
        console.error(
          "Subcategory loading error:",
          error
        );
      }
    };

  /*
  ==========================================================
  INITIAL LOAD
  ==========================================================
  */

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  /*
  ==========================================================
  URL PARAMETER CHANGES
  ==========================================================
  */

  useEffect(() => {
    const urlSearch =
      searchParams.get("search") || "";

    const urlCategoryId =
      searchParams.get(
        "category_id"
      ) || "";

    const urlSubcategoryId =
      searchParams.get(
        "subcategory_id"
      ) || "";

    setSearch(urlSearch);

    setCategoryId(
      urlCategoryId
    );

    setSubcategoryId(
      urlSubcategoryId
    );

    fetchProducts({
      search: urlSearch,
      categoryId: urlCategoryId,
      subcategoryId:
        urlSubcategoryId,
      brand: "",
      color: "",
      size: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    });
  }, [searchParams]);

  /*
  ==========================================================
  FILTERED SUBCATEGORIES
  ==========================================================
  */

  const filteredSubcategories =
    categoryId
      ? subcategories.filter(
          (subcategory) =>
            String(
              subcategory.category_id
            ) ===
            String(categoryId)
        )
      : [];

  /*
  ==========================================================
  CATEGORY CHANGE
  ==========================================================
  */

  const handleCategoryChange = (
    event
  ) => {
    const value =
      event.target.value;

    setCategoryId(value);

    setSubcategoryId("");
  };

  /*
  ==========================================================
  SUBCATEGORY CHANGE
  ==========================================================
  */

  const handleSubcategoryChange = (
    event
  ) => {
    setSubcategoryId(
      event.target.value
    );
  };

  /*
  ==========================================================
  APPLY FILTERS
  ==========================================================
  */

  const handleFilter = (
    event
  ) => {
    event.preventDefault();

    const params =
      new URLSearchParams();

    if (search) {
      params.set(
        "search",
        search
      );
    }

    if (categoryId) {
      params.set(
        "category_id",
        categoryId
      );
    }

    if (subcategoryId) {
      params.set(
        "subcategory_id",
        subcategoryId
      );
    }

    /*
    Keep category/search filters
    visible in URL.
    */

    setSearchParams(params);

    /*
    Fetch complete filter set.
    */

    fetchProducts({
      search,
      categoryId,
      subcategoryId,
      brand,
      color,
      size,
      minPrice,
      maxPrice,
      minRating,
    });
  };

  /*
  ==========================================================
  CLEAR FILTERS
  ==========================================================
  */

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setSubcategoryId("");
    setBrand("");
    setColor("");
    setSize("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");

    setSearchParams({});

    fetchProducts({
      search: "",
      categoryId: "",
      subcategoryId: "",
      brand: "",
      color: "",
      size: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
    });
  };

  /*
  ==========================================================
  WISHLIST
  ==========================================================
  */

  const toggleWishlist = (
    productId
  ) => {
    setWishlistState(
      (previous) => ({
        ...previous,

        [productId]:
          !previous[
            productId
          ],
      })
    );
  };

  /*
  ==========================================================
  PRODUCT IMAGE
  ==========================================================
  */

  const getImageSrc = (
    image
  ) => {
    if (!image) {
      return "/images/products/placeholder.svg";
    }

    const cleanImage =
      String(image).trim();

    /*
    FULL URL
    */

    if (
      cleanImage.startsWith(
        "http://"
      ) ||
      cleanImage.startsWith(
        "https://"
      )
    ) {
      return cleanImage;
    }

    /*
    LARAVEL STORAGE
    */

    if (
      cleanImage.startsWith(
        "storage/"
      )
    ) {
      return `http://127.0.0.1:8000/${cleanImage}`;
    }

    if (
      cleanImage.startsWith(
        "/storage/"
      )
    ) {
      return `http://127.0.0.1:8000${cleanImage}`;
    }

    /*
    FRONTEND PRODUCT IMAGE
    */

    if (
      cleanImage.startsWith(
        "images/products/"
      )
    ) {
      return `/${cleanImage}`;
    }

    if (
      cleanImage.startsWith(
        "/images/products/"
      )
    ) {
      return cleanImage;
    }

    /*
    FILE NAME ONLY
    */

    return `/images/products/${cleanImage}`;
  };

  /*
  ==========================================================
  SELECTED CATEGORY
  ==========================================================
  */

  const selectedCategory =
    categories.find(
      (category) =>
        String(category.id) ===
        String(categoryId)
    );

  /*
  ==========================================================
  SELECTED SUBCATEGORY
  ==========================================================
  */

  const selectedSubcategory =
    subcategories.find(
      (subcategory) =>
        String(
          subcategory.id
        ) ===
        String(
          subcategoryId
        )
    );

  /*
  ==========================================================
  PAGE
  ==========================================================
  */

  return (
    <>
      <Navbar />

      <main className="products-page">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="products-header">

          <div className="container">

            <div className="products-header-content">

              <div>

                <span className="products-subtitle">
                  SHOP OUR COLLECTION
                </span>

                <h1>
                  Explore Our Products
                </h1>

                <p>
                  Discover products from
                  different categories and
                  easily find exactly what
                  you are looking for.
                </p>

              </div>

              <div className="products-header-icon">

                <FaBoxOpen />

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            PRODUCTS CONTENT
        ================================================= */}

        <section className="container products-content">

          <div className="row g-4">

            {/* =================================================
                FILTER PANEL
            ================================================= */}

            <div className="col-12 col-lg-3">

              <div className="filter-card">

                <div className="filter-title-area">

                  <h4>

                    <FaFilter className="me-2" />

                    Filters

                  </h4>

                  <p>
                    Find your perfect product
                  </p>

                </div>

                <form
                  onSubmit={
                    handleFilter
                  }
                >

                  {/* SEARCH */}

                  <div className="filter-group">

                    <label>
                      Search Product
                    </label>

                    <div className="filter-search">

                      <FaSearch />

                      <input
                        type="text"
                        placeholder="Product name..."
                        value={search}
                        onChange={(
                          event
                        ) =>
                          setSearch(
                            event
                              .target
                              .value
                          )
                        }
                      />

                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div className="filter-group">

                    <label>

                      <FaLayerGroup className="me-2" />

                      Category

                    </label>

                    <select
                      value={
                        categoryId
                      }
                      onChange={
                        handleCategoryChange
                      }
                    >

                      <option value="">
                        All Categories
                      </option>

                      {categories.map(
                        (category) => (

                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </option>

                        )
                      )}

                    </select>

                  </div>

                  {/* SUBCATEGORY */}

                  <div className="filter-group">

                    <label>

                      <FaList className="me-2" />

                      Subcategory

                    </label>

                    {!categoryId && (

                      <select
                        disabled
                        value=""
                      >
                        <option value="">
                          Select a category first
                        </option>
                      </select>

                    )}

                    {categoryId && (

                      <select
                        value={
                          subcategoryId
                        }
                        onChange={
                          handleSubcategoryChange
                        }
                      >

                        <option value="">
                          All Subcategories
                        </option>

                        {filteredSubcategories.map(
                          (
                            subcategory
                          ) => (

                            <option
                              key={
                                subcategory.id
                              }
                              value={
                                subcategory.id
                              }
                            >
                              {
                                subcategory.name
                              }
                            </option>

                          )
                        )}

                      </select>

                    )}

                  </div>

                  {/* BRAND */}

                  <div className="filter-group">

                    <label>

                      <FaTag className="me-2" />

                      Brand

                    </label>

                    <input
                      type="text"
                      placeholder="Example: Samsung"
                      value={brand}
                      onChange={(
                        event
                      ) =>
                        setBrand(
                          event
                            .target
                            .value
                        )
                      }
                    />

                  </div>

                  {/* COLOR */}

                  <div className="filter-group">

                    <label>

                      <FaPalette className="me-2" />

                      Color

                    </label>

                    <input
                      type="text"
                      placeholder="Example: Black"
                      value={color}
                      onChange={(
                        event
                      ) =>
                        setColor(
                          event
                            .target
                            .value
                        )
                      }
                    />

                  </div>

                  {/* SIZE */}

                  <div className="filter-group">

                    <label>
                      Size
                    </label>

                    <input
                      type="text"
                      placeholder="Example: M"
                      value={size}
                      onChange={(
                        event
                      ) =>
                        setSize(
                          event
                            .target
                            .value
                        )
                      }
                    />

                  </div>

                  {/* PRICE RANGE */}

                  <div className="filter-group">

                    <label>
                      Price Range (Rs.)
                    </label>

                    <div className="price-inputs">

                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Min Rs."
                        value={
                          minPrice
                        }
                        onChange={(
                          event
                        ) =>
                          setMinPrice(
                            event
                              .target
                              .value
                          )
                        }
                      />

                      <span>
                        -
                      </span>

                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Max Rs."
                        value={
                          maxPrice
                        }
                        onChange={(
                          event
                        ) =>
                          setMaxPrice(
                            event
                              .target
                              .value
                          )
                        }
                      />

                    </div>

                  </div>

                  {/* RATING */}

                  <div className="filter-group">

                    <label>
                      Minimum Rating
                    </label>

                    <select
                      value={
                        minRating
                      }
                      onChange={(
                        event
                      ) =>
                        setMinRating(
                          event
                            .target
                            .value
                        )
                      }
                    >

                      <option value="">
                        Any Rating
                      </option>

                      <option value="4">
                        4 ★ & above
                      </option>

                      <option value="3">
                        3 ★ & above
                      </option>

                      <option value="2">
                        2 ★ & above
                      </option>

                      <option value="1">
                        1 ★ & above
                      </option>

                    </select>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="filter-actions">

                    <button
                      type="submit"
                      className="apply-filter-btn"
                    >

                      <FaSearch className="me-2" />

                      Apply Filters

                    </button>

                    <button
                      type="button"
                      className="clear-filter-btn"
                      onClick={
                        clearFilters
                      }
                    >

                      <FaTimes className="me-2" />

                      Clear Filters

                    </button>

                  </div>

                </form>

              </div>

            </div>

            {/* =================================================
                PRODUCT AREA
            ================================================= */}

            <div className="col-12 col-lg-9">

              {/* TOP BAR */}

              <div className="products-top-bar">

                <div>

                  <h3>

                    {selectedSubcategory
                      ? selectedSubcategory.name
                      : selectedCategory
                      ? selectedCategory.name
                      : "All Products"}

                  </h3>

                  <p>

                    {loading
                      ? "Loading products..."
                      : `${products.length} product${
                          products.length !==
                          1
                            ? "s"
                            : ""
                        } found`}

                  </p>

                </div>

              </div>

              {/* LOADING */}

              {loading && (

                <div className="product-loading">

                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>

                  <p>
                    Loading products...
                  </p>

                </div>

              )}

              {/* NO PRODUCTS */}

              {!loading &&
                products.length ===
                  0 && (

                  <div className="no-products">

                    <FaBoxOpen />

                    <h4>
                      No Products Found
                    </h4>

                    <p>
                      We could not find
                      products matching your
                      selected filters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                    >
                      Clear Filters
                    </button>

                  </div>

                )}

              {/* =================================================
                  PRODUCTS GRID
              ================================================= */}

              {!loading &&
                products.length >
                  0 && (

                  <div className="row g-4">

                    {products.map(
                      (product) => (

                        <div
                          className="col-12 col-md-6 col-xl-4"
                          key={
                            product.id
                          }
                        >

                          <div className="product-card">

                            {/* IMAGE */}

                            <div className="product-image-area">

                              <img
                                src={
                                  getImageSrc(
                                    product.image
                                  )
                                }
                                alt={
                                  product.name
                                }
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.onerror =
                                    null;

                                  event.currentTarget.src =
                                    "/images/products/placeholder.svg";
                                }}
                              />

                              {/* WISHLIST */}

                              <button
                                type="button"
                                aria-label="Add to wishlist"
                                className={`wishlist-button ${
                                  wishlistState[
                                    product.id
                                  ]
                                    ? "wishlist-active"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleWishlist(
                                    product.id
                                  )
                                }
                              >
                                <FaHeart />
                              </button>

                              {/* CATEGORY */}

                              {product.category && (

                                <span className="category-badge">

                                  {
                                    product
                                      .category
                                      .name
                                  }

                                </span>

                              )}

                            </div>

                            {/* PRODUCT BODY */}

                            <div className="product-card-body">

                              {/* BRAND */}

                              <div className="product-brand">

                                {product.brand ||
                                  "ShopEase"}

                              </div>

                              {/* PRODUCT NAME */}

                              <h5>
                                {
                                  product.name
                                }
                              </h5>

                              {/* RATING */}

                              <div className="product-rating">

                                <FaStar />

                                <span>

                                  {Number(
                                    product.rating ||
                                      0
                                  ).toFixed(
                                    1
                                  )}

                                </span>

                              </div>

                              {/* DESCRIPTION */}

                              <p className="product-description">

                                {product.description ||
                                  "Quality product available at ShopEase."}

                              </p>

                              {/* SUBCATEGORY */}

                              {product.subcategory && (

                                <div className="product-details-row">

                                  <span>

                                    {
                                      product
                                        .subcategory
                                        .name
                                    }

                                  </span>

                                </div>

                              )}

                              {/* COLOR + SIZE */}

                              <div className="product-details-row">

                                {product.color && (

                                  <span>
                                    Color:{" "}
                                    {
                                      product.color
                                    }
                                  </span>

                                )}

                                {product.size && (

                                  <span>
                                    Size:{" "}
                                    {
                                      product.size
                                    }
                                  </span>

                                )}

                              </div>

                              {/* STOCK */}

                              <div
                                className={`stock-status ${
                                  Number(
                                    product.stock
                                  ) > 0
                                    ? "in-stock"
                                    : "out-stock"
                                }`}
                              >

                                {Number(
                                  product.stock
                                ) > 0
                                  ? `${product.stock} in stock`
                                  : "Out of stock"}

                              </div>

                              {/* =================================================
                                  PRICE + DETAILS
                              ================================================= */}

                              <div className="product-card-bottom">

                                <div className="product-price">

                                  {formatPrice(
                                    product.price
                                  )}

                                </div>

                                <Link
                                  to={`/products/${product.id}`}
                                  className="view-product-btn"
                                >
                                  View Details
                                </Link>

                              </div>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Products;