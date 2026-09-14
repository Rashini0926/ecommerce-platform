import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import ReviewSection from "../components/ReviewSection";
import { addToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | Product States
  |--------------------------------------------------------------------------
  */

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Cart States
  |--------------------------------------------------------------------------
  */

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
  | Load Product
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setLoading(true);

    setCartMessage("");

    setCartError("");

    setAdded(false);

    fetch(
      `http://127.0.0.1:8000/api/products/${id}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Product request failed."
          );
        }

        return res.json();
      })

      .then((data) => {
        setProduct(data);

        setQuantity(1);

        setLoading(false);
      })

      .catch((err) => {
        console.error(
          "Failed to load product:",
          err
        );

        setProduct(null);

        setLoading(false);
      });
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Add To Cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = async () => {
    /*
     * User must login first
     */

    if (!user) {
      navigate("/login");

      return;
    }

    /*
     * Product validation
     */

    if (!product) {
      return;
    }

    /*
     * Out of stock validation
     */

    if (
      Number(product.stock) <= 0
    ) {
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
      quantity > Number(product.stock)
    ) {
      setCartError(
        `Only ${product.stock} item(s) are available.`
      );

      return;
    }

    try {
      setAddingToCart(true);

      setCartError("");

      setCartMessage("");

      setAdded(false);

      /*
      |--------------------------------------------------------------------------
      | POST /api/cart
      |--------------------------------------------------------------------------
      */

      const response =
        await addToCart(
          product.id,
          quantity
        );

      console.log(
        "Add to cart response:",
        response
      );

      /*
      |--------------------------------------------------------------------------
      | Notify Navbar that cart changed
      |--------------------------------------------------------------------------
      |
      | Navbar listens to "cartUpdated"
      | and reloads GET /api/cart.
      |
      */

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      /*
      |--------------------------------------------------------------------------
      | Success UI
      |--------------------------------------------------------------------------
      */

      setAdded(true);

      setCartMessage(
        `${product.name} added to your cart successfully.`
      );

      /*
       * Reset quantity after adding
       */

      setQuantity(1);

      /*
       * Reset green button
       */

      setTimeout(() => {
        setAdded(false);
      }, 2000);

    } catch (err) {

      console.error(
        "Add to cart error:",
        err
      );

      /*
      |--------------------------------------------------------------------------
      | Unauthorized
      |--------------------------------------------------------------------------
      */

      if (
        err.response?.status === 401
      ) {
        setCartError(
          "Please login before adding products to your cart."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Validation / backend error
      |--------------------------------------------------------------------------
      */

      setCartError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to add this product to the cart."
      );

    } finally {

      setAddingToCart(false);

    }
  };

  /*
  |--------------------------------------------------------------------------
  | Decrease Quantity
  |--------------------------------------------------------------------------
  */

  const handleDecreaseQuantity = () => {
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
  | Increase Quantity
  |--------------------------------------------------------------------------
  */

  const handleIncreaseQuantity = () => {
    setCartError("");

    if (!product) {
      return;
    }

    /*
     * Prevent quantity from
     * becoming greater than stock
     */

    if (
      quantity >=
      Number(product.stock)
    ) {
      setCartError(
        `Only ${product.stock} item(s) are available in stock.`
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
  | Placeholder Image
  |--------------------------------------------------------------------------
  */

  const placeholderImage = `${
    import.meta.env.BASE_URL
  }images/products/placeholder.svg`;

  /*
  |--------------------------------------------------------------------------
  | Get Product Image URL
  |--------------------------------------------------------------------------
  */

  const getImageSrc = (image) => {
    if (!image) {
      return placeholderImage;
    }

    const cleanImage =
      String(image).trim();

    /*
     * External full URL
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
     * Backend storage image
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
     * Already starts with
     * images/products/
     */

    if (
      cleanImage.startsWith(
        "images/products/"
      )
    ) {
      return `${
        import.meta.env.BASE_URL
      }${cleanImage}`;
    }

    if (
      cleanImage.startsWith(
        "/images/products/"
      )
    ) {
      return cleanImage;
    }

    /*
     * Only filename
     *
     * Example:
     * samsungS23.jpg
     */

    return `${
      import.meta.env.BASE_URL
    }images/products/${cleanImage}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Loading Screen
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(180deg, #f4f7fc 0%, #eef2f9 100%)",

          minHeight: "100vh",

          color: "#0f172a",

          padding: "48px 0",
        }}
      >
        <div className="container">

          <div
            style={{
              background: "#ffffff",

              border:
                "1px solid #e7eefb",

              borderRadius:
                "24px",

              padding:
                "32px",

              boxShadow:
                "0 16px 34px rgba(15, 23, 42, 0.06)",

              textAlign:
                "center",
            }}
          >

            <p
              className="mb-2"
              style={{
                fontSize:
                  "12px",

                color:
                  "#2563eb",

                fontWeight:
                  700,

                letterSpacing:
                  "0.08em",

                textTransform:
                  "uppercase",
              }}
            >
              Product details
            </p>

            <p
              style={{
                fontSize:
                  "16px",

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
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Product Not Found
  |--------------------------------------------------------------------------
  */

  if (!product) {
    return (
      <div
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

              textAlign:
                "center",
            }}
          >

            <p
              className="mb-2"
              style={{
                fontSize:
                  "12px",

                color:
                  "#2563eb",

                fontWeight:
                  700,

                letterSpacing:
                  "0.08em",

                textTransform:
                  "uppercase",
              }}
            >
              Product details
            </p>

            <p
              className="mb-3"
              style={{
                fontSize:
                  "16px",

                color:
                  "#64748b",
              }}
            >
              Product not found.
            </p>

            <Link
              to="/products"
              style={{
                fontSize:
                  "14px",

                color:
                  "#2563eb",

                textDecoration:
                  "none",

                fontWeight:
                  700,
              }}
            >
              ← Back to Products
            </Link>

          </div>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Product Details Page
  |--------------------------------------------------------------------------
  */

  return (
    <div
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
            BACK TO PRODUCTS
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

          <span aria-hidden="true">
            ←
          </span>

          <span>
            Back to Products
          </span>

        </Link>


        <div className="row g-5 align-items-start">

          {/* ==============================================================
              PRODUCT IMAGE
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

                onError={(e) => {

                  e.currentTarget.onerror =
                    null;

                  e.currentTarget.src =
                    placeholderImage;

                }}
              />

            </div>

          </div>


          {/* ==============================================================
              PRODUCT INFORMATION
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

              {/* ----------------------------------------------------------
                  BRAND
              ---------------------------------------------------------- */}

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


              {/* ----------------------------------------------------------
                  PRODUCT NAME
              ---------------------------------------------------------- */}

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


              {/* ----------------------------------------------------------
                  PRICE + RATING
              ---------------------------------------------------------- */}

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
                      "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",

                    padding:
                      "6px 12px",

                    borderRadius:
                      "999px",

                    boxShadow:
                      "inset 0 1px 2px rgba(249, 115, 22, 0.12)",
                  }}
                >

                  ★{" "}

                  {product.rating ||
                    0}

                </span>

              </div>


              {/* ----------------------------------------------------------
                  DESCRIPTION
              ---------------------------------------------------------- */}

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

                {product.description}

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

                <h6
                  className="fw-bold mb-3"
                  style={{
                    fontSize:
                      "14px",

                    color:
                      "#0f172a",
                  }}
                >
                  Specifications
                </h6>


                <div
                  style={{
                    fontSize:
                      "13.5px",
                  }}
                >

                  {/* CATEGORY */}

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
                      Category
                    </span>

                    <span
                      style={{
                        fontWeight:
                          600,

                        color:
                          "#0f172a",
                      }}
                    >

                      {product.category?.name ||
                        "—"}

                    </span>

                  </div>


                  {/* SUBCATEGORY */}

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
                      Subcategory
                    </span>

                    <span
                      style={{
                        fontWeight:
                          600,

                        color:
                          "#0f172a",
                      }}
                    >

                      {product.subcategory?.name ||
                        "—"}

                    </span>

                  </div>


                  {/* BRAND */}

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
                      Brand
                    </span>

                    <span
                      style={{
                        fontWeight:
                          600,

                        color:
                          "#0f172a",
                      }}
                    >

                      {product.brand ||
                        "—"}

                    </span>

                  </div>


                  {/* COLOR */}

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
                      Color
                    </span>

                    <span
                      style={{
                        fontWeight:
                          600,

                        color:
                          "#0f172a",
                      }}
                    >

                      {product.color ||
                        "—"}

                    </span>

                  </div>


                  {/* SIZE */}

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
                      Size
                    </span>

                    <span
                      style={{
                        fontWeight:
                          600,

                        color:
                          "#0f172a",
                      }}
                    >

                      {product.size ||
                        "—"}

                    </span>

                  </div>


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
                          Number(
                            product.stock
                          ) > 0
                            ? "#16a34a"
                            : "#dc2626",
                      }}
                    >

                      {Number(
                        product.stock
                      ) > 0
                        ? `${product.stock} available`
                        : "Out of stock"}

                    </span>

                  </div>

                </div>

              </div>


              {/* ==========================================================
                  CART SUCCESS MESSAGE
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
                  CART ERROR
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
                  QUANTITY + ADD TO CART
              ========================================================== */}

              <div className="d-flex flex-column flex-md-row align-items-stretch gap-3">


                {/* --------------------------------------------------------
                    QUANTITY
                -------------------------------------------------------- */}

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

                      color:
                        quantity <= 1
                          ? "#94a3b8"
                          : "#2563eb",

                      fontWeight:
                        700,

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
                      quantity >=
                        Number(
                          product.stock
                        )
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

                      color:
                        quantity >=
                        Number(
                          product.stock
                        )
                          ? "#94a3b8"
                          : "#2563eb",

                      fontWeight:
                        700,

                      cursor:
                        quantity >=
                        Number(
                          product.stock
                        )
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >

                    +

                  </button>

                </div>


                {/* --------------------------------------------------------
                    ADD TO CART
                -------------------------------------------------------- */}

                <button
                  type="button"

                  onClick={
                    handleAddToCart
                  }

                  disabled={
                    addingToCart ||
                    Number(
                      product.stock
                    ) <= 0
                  }

                  onMouseEnter={(e) => {

                    if (
                      !addingToCart &&
                      Number(
                        product.stock
                      ) > 0
                    ) {

                      e.currentTarget.style.transform =
                        "translateY(-2px)";

                      e.currentTarget.style.boxShadow =
                        "0 12px 26px rgba(37, 99, 235, 0.26)";

                    }

                  }}

                  onMouseLeave={(e) => {

                    e.currentTarget.style.transform =
                      "none";

                    e.currentTarget.style.boxShadow =
                      "0 10px 22px rgba(37, 99, 235, 0.2)";

                  }}

                  style={{
                    flex:
                      1,

                    background:
                      Number(
                        product.stock
                      ) <= 0

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

                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease",

                    boxShadow:
                      "0 10px 22px rgba(37, 99, 235, 0.2)",

                    cursor:
                      addingToCart ||
                      Number(
                        product.stock
                      ) <= 0
                        ? "not-allowed"
                        : "pointer",

                    opacity:
                      addingToCart
                        ? 0.8
                        : 1,
                  }}
                >

                  {Number(
                    product.stock
                  ) <= 0

                    ? "Out of Stock"

                    : addingToCart

                    ? "Adding..."

                    : added

                    ? "✓ Added to Cart"

                    : "Add to Cart"}

                </button>

              </div>


              {/* ==========================================================
                  VIEW CART
              ========================================================== */}

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
            PRODUCT REVIEWS
        ================================================================ */}

        <ReviewSection
          productId={
            product.id
          }
        />

      </div>

    </div>
  );
}

export default ProductDetails;