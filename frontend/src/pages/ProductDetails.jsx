import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import ReviewSection from "../components/ReviewSection";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../services/cartService";
import { getProduct } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, token } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const [added, setAdded] =
    useState(false);

  const [cartMessage, setCartMessage] =
    useState("");

  const [cartError, setCartError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | PLACEHOLDER IMAGE
  |--------------------------------------------------------------------------
  */

  const placeholderImage =
    `${
      import.meta.env.BASE_URL
    }images/products/placeholder.svg`;

  /*
  |--------------------------------------------------------------------------
  | LOAD PRODUCT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        setProduct(null);

        setCartMessage("");

        setCartError("");

        setAdded(false);

        setQuantity(1);

        /*
         * Use existing
         * productService.js
         */
        const data =
          await getProduct(id);

        /*
         * Support:
         *
         * direct product object
         *
         * OR
         *
         * { product: {...} }
         */
        const productData =
          data?.product ||
          data;

        setProduct(
          productData
        );

      } catch (error) {

        console.error(
          "Failed to load product:",
          error
        );

        setProduct(null);

      } finally {

        setLoading(false);

      }
    };

    loadProduct();

  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | PRODUCT IMAGE
  |--------------------------------------------------------------------------
  */

  const getImageSrc = (
    image
  ) => {
    if (!image) {
      return placeholderImage;
    }

    const cleanImage =
      String(image).trim();

    /*
     * Full external URL
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
     * Laravel public storage
     */

    if (
      cleanImage.startsWith(
        "/storage/"
      )
    ) {
      return `http://127.0.0.1:8000${cleanImage}`;
    }

    if (
      cleanImage.startsWith(
        "storage/"
      )
    ) {
      return `http://127.0.0.1:8000/${cleanImage}`;
    }

    /*
     * Frontend public product
     * images
     */

    if (
      cleanImage.startsWith(
        "/images/products/"
      )
    ) {
      return cleanImage;
    }

    if (
      cleanImage.startsWith(
        "images/products/"
      )
    ) {
      return `${
        import.meta.env.BASE_URL
      }${cleanImage}`;
    }

    /*
     * Normal frontend public path
     */

    if (
      cleanImage.startsWith("/")
    ) {
      return cleanImage;
    }

    /*
     * Image filename only
     *
     * example:
     * samsung.jpg
     */

    return `${
      import.meta.env.BASE_URL
    }images/products/${cleanImage}`;
  };

  /*
  |--------------------------------------------------------------------------
  | DECREASE QUANTITY
  |--------------------------------------------------------------------------
  */

  const handleDecreaseQuantity =
    () => {

      setCartError("");

      setQuantity(
        (currentQuantity) =>
          Math.max(
            1,
            currentQuantity - 1
          )
      );
    };

  /*
  |--------------------------------------------------------------------------
  | INCREASE QUANTITY
  |--------------------------------------------------------------------------
  */

  const handleIncreaseQuantity =
    () => {

      if (!product) {
        return;
      }

      setCartError("");

      const stock =
        Number(
          product.stock || 0
        );

      /*
       * Do not allow quantity
       * greater than stock
       */

      if (
        quantity >= stock
      ) {

        setCartError(
          `Only ${stock} item(s) are available in stock.`
        );

        return;
      }

      setQuantity(
        (currentQuantity) =>
          currentQuantity + 1
      );
    };

  /*
  |--------------------------------------------------------------------------
  | ADD TO CART
  |--------------------------------------------------------------------------
  */

  const handleAddToCart =
    async () => {

      /*
       * Login required
       */

      if (
        !user ||
        !token
      ) {

        navigate(
          "/login"
        );

        return;
      }

      /*
       * Product must exist
       */

      if (!product) {
        return;
      }

      const stock =
        Number(
          product.stock || 0
        );

      /*
       * Stock validation
       */

      if (stock <= 0) {

        setCartError(
          "This product is currently out of stock."
        );

        return;
      }

      /*
       * Quantity validation
       */

      if (
        quantity < 1 ||
        quantity > stock
      ) {

        setCartError(
          `Only ${stock} item(s) are available.`
        );

        return;
      }

      try {

        setAddingToCart(true);

        setAdded(false);

        setCartError("");

        setCartMessage("");

        /*
        |--------------------------------------------------------------------------
        | ADD PRODUCT
        |--------------------------------------------------------------------------
        */

        await addToCart(
          product.id,
          quantity
        );

        /*
        |--------------------------------------------------------------------------
        | UPDATE NAVBAR CART COUNT
        |--------------------------------------------------------------------------
        |
        | Navbar.jsx listens for
        | cartUpdated.
        |
        */

        window.dispatchEvent(
          new Event(
            "cartUpdated"
          )
        );

        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        setAdded(true);

        setCartMessage(
          `${product.name} added to your cart successfully.`
        );

        /*
         * Reset quantity
         */

        setQuantity(1);

        /*
         * Reset success button
         */

        setTimeout(() => {

          setAdded(false);

        }, 2000);

      } catch (error) {

        console.error(
          "Add to cart error:",
          error
        );

        /*
         * Unauthorized
         */

        if (
          error.response
            ?.status === 401
        ) {

          setCartError(
            "Please login before adding products to your cart."
          );

          return;
        }

        /*
         * Forbidden
         */

        if (
          error.response
            ?.status === 403
        ) {

          setCartError(
            error.response
              ?.data?.message ||
              "This account cannot use the shopping cart."
          );

          return;
        }

        /*
         * Validation /
         * backend error
         */

        setCartError(
          error.response
            ?.data?.message ||
            error.response
              ?.data?.error ||
            "Unable to add this product to the cart."
        );

      } finally {

        setAddingToCart(false);

      }
    };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <main
        style={{
          background:
            "linear-gradient(180deg, #f4f7fc 0%, #eef2f9 100%)",

          minHeight:
            "100vh",

          padding:
            "48px 0",
        }}
      >

        <div className="container">

          <div
            style={{
              background:
                "#ffffff",

              border:
                "1px solid #e7eefb",

              borderRadius:
                "24px",

              padding:
                "32px",

              textAlign:
                "center",

              boxShadow:
                "0 16px 34px rgba(15, 23, 42, 0.06)",
            }}
          >

            <p
              style={{
                color:
                  "#2563eb",

                fontWeight:
                  700,

                fontSize:
                  "12px",

                letterSpacing:
                  "0.08em",

                textTransform:
                  "uppercase",
              }}
            >
              Product Details
            </p>

            <div
              className="spinner-border text-primary mb-3"
              role="status"
            />

            <p
              style={{
                color:
                  "#64748b",

                marginBottom:
                  0,
              }}
            >
              Loading product...
            </p>

          </div>

        </div>

      </main>

    );
  }

  /*
  |--------------------------------------------------------------------------
  | PRODUCT NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!product) {

    return (

      <main
        style={{
          background:
            "linear-gradient(180deg, #f4f7fc 0%, #eef2f9 100%)",

          minHeight:
            "100vh",

          padding:
            "48px 0",
        }}
      >

        <div className="container">

          <div
            style={{
              background:
                "#ffffff",

              border:
                "1px solid #e7eefb",

              borderRadius:
                "24px",

              padding:
                "32px",

              textAlign:
                "center",

              boxShadow:
                "0 16px 34px rgba(15, 23, 42, 0.06)",
            }}
          >

            <h3
              style={{
                color:
                  "#0f172a",
              }}
            >
              Product not found
            </h3>

            <p
              style={{
                color:
                  "#64748b",
              }}
            >
              The requested product
              could not be loaded.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Back to Products
            </Link>

          </div>

        </div>

      </main>

    );
  }

  /*
  |--------------------------------------------------------------------------
  | PRODUCT DETAILS
  |--------------------------------------------------------------------------
  */

  const stock =
    Number(
      product.stock || 0
    );

  return (

    <main
      style={{
        background:
          "linear-gradient(180deg, #f4f7fc 0%, #eef2f9 100%)",

        minHeight:
          "100vh",

        color:
          "#0f172a",

        padding:
          "48px 0",
      }}
    >

      <div className="container">

        {/* ================================================================
            BACK BUTTON
        ================================================================ */}

        <Link
          to="/products"

          style={{
            display:
              "inline-flex",

            alignItems:
              "center",

            gap:
              "8px",

            fontSize:
              "13.5px",

            color:
              "#2563eb",

            textDecoration:
              "none",

            fontWeight:
              700,

            marginBottom:
              "24px",
          }}
        >

          ← Back to Products

        </Link>


        {/* ================================================================
            PRODUCT MAIN SECTION
        ================================================================ */}

        <div className="row g-5 align-items-start">


          {/* ==============================================================
              IMAGE
          ============================================================== */}

          <div className="col-12 col-lg-5">

            <div
              style={{
                background:
                  "#f4f7fc",

                borderRadius:
                  "24px",

                overflow:
                  "hidden",

                border:
                  "1px solid #e7eefb",

                boxShadow:
                  "0 16px 34px rgba(15, 23, 42, 0.06)",

                padding:
                  "18px",
              }}
            >

              <img
                src={
                  getImageSrc(
                    product.image
                  )
                }

                alt={
                  product.name ||
                  "Product"
                }

                style={{
                  width:
                    "100%",

                  height:
                    "420px",

                  objectFit:
                    "cover",

                  borderRadius:
                    "18px",
                }}

                onError={(event) => {

                  event.currentTarget.onerror =
                    null;

                  event.currentTarget.src =
                    placeholderImage;

                }}
              />

            </div>

          </div>


          {/* ==============================================================
              DETAILS
          ============================================================== */}

          <div className="col-12 col-lg-7">

            <div
              style={{
                background:
                  "#ffffff",

                border:
                  "1px solid #e7eefb",

                borderRadius:
                  "24px",

                padding:
                  "32px",

                boxShadow:
                  "0 16px 34px rgba(15, 23, 42, 0.06)",
              }}
            >


              {/* BRAND */}

              <p
                className="mb-2"

                style={{
                  fontSize:
                    "12.5px",

                  color:
                    "#64748b",

                  fontWeight:
                    700,

                  letterSpacing:
                    "0.08em",

                  textTransform:
                    "uppercase",
                }}
              >

                {product.brand
                  ?.toUpperCase() ||
                  "SHOPEASE"}

              </p>


              {/* PRODUCT NAME */}

              <h2
                className="fw-bold mb-3"

                style={{
                  fontSize:
                    "28px",

                  color:
                    "#0f172a",
                }}
              >

                {product.name}

              </h2>


              {/* PRICE + RATING */}

              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">

                <span
                  style={{
                    fontSize:
                      "28px",

                    fontWeight:
                      800,

                    color:
                      "#2563eb",
                  }}
                >

                  $

                  {Number(
                    product.price ||
                    0
                  ).toFixed(2)}

                </span>


                <span
                  style={{
                    fontSize:
                      "13.5px",

                    color:
                      "#f59e0b",

                    fontWeight:
                      700,

                    background:
                      "#fff7ed",

                    padding:
                      "6px 12px",

                    borderRadius:
                      "999px",
                  }}
                >

                  ★{" "}

                  {Number(
                    product.rating ||
                    0
                  ).toFixed(1)}

                </span>

              </div>


              {/* DESCRIPTION */}

              <p
                className="mb-4"

                style={{
                  fontSize:
                    "14.5px",

                  color:
                    "#64748b",

                  lineHeight:
                    1.7,
                }}
              >

                {product.description ||
                  "No description available."}

              </p>


              {/* ==========================================================
                  SPECIFICATIONS
              ========================================================== */}

              <div
                className="mb-4"

                style={{
                  background:
                    "#f8fafc",

                  border:
                    "1px solid #e7eefb",

                  borderRadius:
                    "18px",

                  padding:
                    "18px 20px",
                }}
              >

                <h6 className="fw-bold mb-3">
                  Specifications
                </h6>


                {/* CATEGORY */}

                <SpecificationRow
                  label="Category"
                  value={
                    product.category
                      ?.name ||
                    "—"
                  }
                />


                {/* SUBCATEGORY */}

                <SpecificationRow
                  label="Subcategory"
                  value={
                    product.subcategory
                      ?.name ||
                    "—"
                  }
                />


                {/* BRAND */}

                <SpecificationRow
                  label="Brand"
                  value={
                    product.brand ||
                    "—"
                  }
                />


                {/* COLOR */}

                <SpecificationRow
                  label="Color"
                  value={
                    product.color ||
                    "—"
                  }
                />


                {/* SIZE */}

                <SpecificationRow
                  label="Size"
                  value={
                    product.size ||
                    "—"
                  }
                />


                {/* STOCK */}

                <div className="d-flex justify-content-between align-items-center py-2">

                  <span
                    style={{
                      color:
                        "#64748b",
                    }}
                  >
                    Stock
                  </span>

                  <span
                    style={{
                      fontWeight:
                        600,

                      color:
                        stock > 0
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >

                    {stock > 0
                      ? `${stock} available`
                      : "Out of stock"}

                  </span>

                </div>

              </div>


              {/* ==========================================================
                  SUCCESS MESSAGE
              ========================================================== */}

              {cartMessage && (

                <div
                  style={{
                    background:
                      "#ecfdf3",

                    color:
                      "#15803d",

                    border:
                      "1px solid #bbf7d0",

                    padding:
                      "12px 15px",

                    borderRadius:
                      "12px",

                    marginBottom:
                      "15px",

                    fontSize:
                      "14px",

                    fontWeight:
                      600,
                  }}
                >

                  ✓ {cartMessage}

                </div>

              )}


              {/* ==========================================================
                  ERROR MESSAGE
              ========================================================== */}

              {cartError && (

                <div
                  style={{
                    background:
                      "#fef2f2",

                    color:
                      "#dc2626",

                    border:
                      "1px solid #fecaca",

                    padding:
                      "12px 15px",

                    borderRadius:
                      "12px",

                    marginBottom:
                      "15px",

                    fontSize:
                      "14px",

                    fontWeight:
                      600,
                  }}
                >

                  {cartError}

                </div>

              )}


              {/* ==========================================================
                  QUANTITY + CART
              ========================================================== */}

              <div className="d-flex flex-column flex-md-row align-items-stretch gap-3">


                {/* QUANTITY */}

                <div
                  className="d-flex align-items-center justify-content-center"

                  style={{
                    border:
                      "1px solid #dbe7f8",

                    borderRadius:
                      "999px",

                    padding:
                      "4px",

                    background:
                      "#f8fbff",

                    minWidth:
                      "150px",
                  }}
                >


                  {/* MINUS */}

                  <button
                    type="button"

                    onClick={
                      handleDecreaseQuantity
                    }

                    disabled={
                      quantity <= 1 ||
                      addingToCart
                    }

                    aria-label="Decrease quantity"

                    style={{
                      border:
                        "none",

                      background:
                        "transparent",

                      width:
                        "42px",

                      height:
                        "42px",

                      fontSize:
                        "18px",

                      fontWeight:
                        700,

                      color:
                        quantity <= 1
                          ? "#94a3b8"
                          : "#2563eb",

                      cursor:
                        quantity <= 1
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    −
                  </button>


                  {/* CURRENT QUANTITY */}

                  <span
                    style={{
                      padding:
                        "0 12px",

                      fontSize:
                        "14px",

                      fontWeight:
                        700,

                      color:
                        "#0f172a",

                      minWidth:
                        "45px",

                      textAlign:
                        "center",
                    }}
                  >

                    {quantity}

                  </span>


                  {/* PLUS */}

                  <button
                    type="button"

                    onClick={
                      handleIncreaseQuantity
                    }

                    disabled={
                      addingToCart ||
                      quantity >= stock ||
                      stock <= 0
                    }

                    aria-label="Increase quantity"

                    style={{
                      border:
                        "none",

                      background:
                        "transparent",

                      width:
                        "42px",

                      height:
                        "42px",

                      fontSize:
                        "18px",

                      fontWeight:
                        700,

                      color:
                        quantity >= stock ||
                        stock <= 0
                          ? "#94a3b8"
                          : "#2563eb",

                      cursor:
                        quantity >= stock ||
                        stock <= 0
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    +
                  </button>

                </div>


                {/* ADD TO CART */}

                <button
                  type="button"

                  onClick={
                    handleAddToCart
                  }

                  disabled={
                    addingToCart ||
                    stock <= 0
                  }

                  style={{
                    flex:
                      1,

                    background:
                      stock <= 0
                        ? "#94a3b8"
                        : added
                        ? "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
                        : "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",

                    color:
                      "#ffffff",

                    border:
                      "none",

                    borderRadius:
                      "999px",

                    padding:
                      "12px 18px",

                    fontSize:
                      "14.5px",

                    fontWeight:
                      700,

                    boxShadow:
                      "0 10px 22px rgba(37, 99, 235, 0.2)",

                    cursor:
                      addingToCart ||
                      stock <= 0
                        ? "not-allowed"
                        : "pointer",

                    opacity:
                      addingToCart
                        ? 0.8
                        : 1,

                    transition:
                      "all 0.2s ease",
                  }}
                >

                  {stock <= 0
                    ? "Out of Stock"
                    : addingToCart
                    ? "Adding..."
                    : added
                    ? "✓ Added to Cart"
                    : "Add to Cart"}

                </button>

              </div>


              {/* VIEW CART */}

              {added && (

                <div
                  style={{
                    textAlign:
                      "right",

                    marginTop:
                      "14px",
                  }}
                >

                  <Link
                    to="/cart"

                    style={{
                      color:
                        "#2563eb",

                      fontSize:
                        "13.5px",

                      fontWeight:
                        700,

                      textDecoration:
                        "none",
                    }}
                  >
                    View Cart →
                  </Link>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* ================================================================
            REVIEWS
        ================================================================ */}

        <div
          style={{
            marginTop:
              "48px",
          }}
        >

          <ReviewSection
            productId={
              product.id
            }
          />

        </div>

      </div>

    </main>
  );
}


/*
|--------------------------------------------------------------------------
| SPECIFICATION ROW COMPONENT
|--------------------------------------------------------------------------
*/

function SpecificationRow({
  label,
  value,
}) {
  return (

    <div
      className="d-flex justify-content-between align-items-center py-2"

      style={{
        borderBottom:
          "1px solid #e7eefb",
      }}
    >

      <span
        style={{
          color:
            "#64748b",
        }}
      >
        {label}
      </span>

      <span
        style={{
          color:
            "#0f172a",

          fontWeight:
            600,
        }}
      >
        {value}
      </span>

    </div>

  );
}

export default ProductDetails;