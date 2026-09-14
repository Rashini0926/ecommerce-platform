import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaBoxOpen,
} from "react-icons/fa";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";

import "./Cart.css";

/*
|--------------------------------------------------------------------------
| CART SETTINGS
|--------------------------------------------------------------------------
*/

const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING_FEE = 10;

/*
|--------------------------------------------------------------------------
| PRICE FORMATTER
|--------------------------------------------------------------------------
*/

const formatPrice = (amount) => {
  return `Rs. ${Number(amount || 0).toFixed(2)}`;
};

function Cart() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD CART
  |--------------------------------------------------------------------------
  */

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCart();

      const items =
        data?.items ||
        data?.cart ||
        data?.cart_items ||
        (Array.isArray(data) ? data : []);

      setCartItems(items);
    } catch (err) {
      console.error("Cart loading error:", err);

      if (err.response?.status === 401) {
        setError("Please login to view your cart.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load your cart."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD CART ON PAGE OPEN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadCart();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | GET PRODUCT
  |--------------------------------------------------------------------------
  */

  const getProduct = (item) => {
    return item?.product || {};
  };

  /*
  |--------------------------------------------------------------------------
  | PRODUCT IMAGE
  |--------------------------------------------------------------------------
  */

  const getImageUrl = (product) => {
    if (!product?.image) {
      return "/images/products/placeholder.svg";
    }

    const image = String(product.image).trim();

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("storage/")) {
      return `http://127.0.0.1:8000/${image}`;
    }

    if (image.startsWith("/storage/")) {
      return `http://127.0.0.1:8000${image}`;
    }

    if (image.startsWith("images/products/")) {
      return `/${image}`;
    }

    if (image.startsWith("/images/products/")) {
      return image;
    }

    return `/images/products/${image}`;
  };

  /*
  |--------------------------------------------------------------------------
  | NOTIFY NAVBAR
  |--------------------------------------------------------------------------
  */

  const notifyCartUpdated = () => {
    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE QUANTITY
  |--------------------------------------------------------------------------
  */

  const handleQuantityChange = async (
    item,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      return;
    }

    const product = getProduct(item);

    /*
    |--------------------------------------------------------------------------
    | STOCK VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
      product.stock !== undefined &&
      newQuantity > Number(product.stock)
    ) {
      setError(
        `Only ${product.stock} item(s) available in stock.`
      );

      return;
    }

    try {
      setUpdatingId(item.id);
      setError("");
      setMessage("");

      await updateCartItem(
        item.id,
        newQuantity
      );

      setCartItems((previousItems) =>
        previousItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: newQuantity,
              }
            : cartItem
        )
      );

      notifyCartUpdated();
    } catch (err) {
      console.error(
        "Quantity update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update quantity."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE CART ITEM
  |--------------------------------------------------------------------------
  */

  const handleRemove = async (itemId) => {
    const confirmed = window.confirm(
      "Remove this product from your cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(itemId);
      setError("");
      setMessage("");

      await removeCartItem(itemId);

      setCartItems((previousItems) =>
        previousItems.filter(
          (item) =>
            item.id !== itemId
        )
      );

      notifyCartUpdated();

      setMessage(
        "Product removed from cart."
      );
    } catch (err) {
      console.error(
        "Remove cart item error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to remove product."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR CART
  |--------------------------------------------------------------------------
  */

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await clearCart();

      setCartItems([]);

      notifyCartUpdated();

      setMessage(
        "Cart cleared successfully."
      );
    } catch (err) {
      console.error(
        "Clear cart error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to clear cart."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TOTAL ITEM QUANTITY
  |--------------------------------------------------------------------------
  */

  const totalItemCount =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  /*
  |--------------------------------------------------------------------------
  | SUBTOTAL
  |--------------------------------------------------------------------------
  */

  const subtotal =
    cartItems.reduce(
      (total, item) => {
        const product =
          getProduct(item);

        const price =
          Number(
            product.price || 0
          );

        const quantity =
          Number(
            item.quantity || 1
          );

        return (
          total +
          price * quantity
        );
      },
      0
    );

  /*
  |--------------------------------------------------------------------------
  | SHIPPING
  |--------------------------------------------------------------------------
  |
  | Less than Rs. 100
  |     → Rs. 10 shipping
  |
  | Rs. 100 or more
  |     → FREE shipping
  |
  */

  const shipping =
    subtotal > 0
      ? subtotal >=
        FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_FEE
      : 0;

  /*
  |--------------------------------------------------------------------------
  | AMOUNT NEEDED FOR FREE SHIPPING
  |--------------------------------------------------------------------------
  */

  const amountForFreeShipping =
    subtotal > 0 &&
    subtotal <
      FREE_SHIPPING_THRESHOLD
      ? FREE_SHIPPING_THRESHOLD -
        subtotal
      : 0;

  /*
  |--------------------------------------------------------------------------
  | FINAL TOTAL
  |--------------------------------------------------------------------------
  */

  const total =
    subtotal + shipping;

  /*
  |--------------------------------------------------------------------------
  | LOADING SCREEN
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <div className="cart-loader"></div>

            <p>
              Loading your cart...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="cart-page">
      <div className="cart-container">

        {/* ================================================================
            CART HEADER
        ================================================================ */}

        <div className="cart-heading">
          <div>
            <span className="cart-eyebrow">
              REVIEW YOUR ORDER
            </span>

            <h1>
              <FaShoppingCart />
              Shopping Cart
            </h1>
          </div>

          <span className="cart-count">
            {totalItemCount}{" "}
            {totalItemCount === 1
              ? "item"
              : "items"}
          </span>
        </div>

        {/* ================================================================
            ERROR MESSAGE
        ================================================================ */}

        {error && (
          <div className="cart-alert cart-error">
            {error}
          </div>
        )}

        {/* ================================================================
            SUCCESS MESSAGE
        ================================================================ */}

        {message && (
          <div className="cart-alert cart-success">
            {message}
          </div>
        )}

        {/* ================================================================
            EMPTY CART
        ================================================================ */}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FaBoxOpen />
            </div>

            <h2>
              Your cart is empty.
            </h2>

            <p>
              Add products to your cart
              and continue checkout when
              ready.
            </p>

            <Link
              to="/products"
              className="continue-shopping-btn"
            >
              <FaArrowLeft />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* ============================================================
                CART PRODUCTS
            ============================================================ */}

            <section className="cart-items-section">

              <div className="cart-items-header">
                <h2>
                  Your Products
                </h2>

                <button
                  type="button"
                  className="clear-cart-btn"
                  onClick={
                    handleClearCart
                  }
                >
                  <FaTrash />
                  Clear Cart
                </button>
              </div>

              <div className="cart-items-list">

                {cartItems.map(
                  (item) => {
                    const product =
                      getProduct(item);

                    const itemTotal =
                      Number(
                        product.price ||
                          0
                      ) *
                      Number(
                        item.quantity ||
                          1
                      );

                    return (
                      <article
                        className="cart-item-card"
                        key={item.id}
                      >

                        {/* IMAGE */}

                        <Link
                          to={`/products/${product.id}`}
                          className="cart-product-image"
                        >
                          <img
                            src={
                              getImageUrl(
                                product
                              )
                            }
                            alt={
                              product.name ||
                              "Product"
                            }
                            onError={(e) => {
                              e.currentTarget.onerror =
                                null;

                              e.currentTarget.src =
                                "/images/products/placeholder.svg";
                            }}
                          />
                        </Link>

                        {/* PRODUCT INFO */}

                        <div className="cart-product-info">

                          <span className="cart-product-brand">
                            {product.brand ||
                              "ShopEase"}
                          </span>

                          <Link
                            to={`/products/${product.id}`}
                            className="cart-product-name"
                          >
                            {product.name ||
                              "Product"}
                          </Link>

                          <div className="cart-product-meta">

                            {product.color && (
                              <span>
                                Color:{" "}
                                {product.color}
                              </span>
                            )}

                            {product.size && (
                              <span>
                                Size:{" "}
                                {product.size}
                              </span>
                            )}

                          </div>

                          <span className="cart-stock">
                            {product.stock ??
                              0}{" "}
                            available
                          </span>

                          {/* MOBILE PRICE */}

                          <div className="cart-mobile-price">
                            {formatPrice(
                              product.price
                            )}
                          </div>

                        </div>

                        {/* CART ACTIONS */}

                        <div className="cart-item-actions">

                          {/* PRODUCT PRICE */}

                          <div className="cart-price">
                            {formatPrice(
                              product.price
                            )}
                          </div>

                          {/* QUANTITY */}

                          <div className="quantity-control">

                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  Number(
                                    item.quantity
                                  ) - 1
                                )
                              }
                              disabled={
                                Number(
                                  item.quantity
                                ) <= 1 ||
                                updatingId ===
                                  item.id
                              }
                            >
                              <FaMinus />
                            </button>

                            <span>
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  Number(
                                    item.quantity
                                  ) + 1
                                )
                              }
                              disabled={
                                updatingId ===
                                  item.id ||
                                Number(
                                  item.quantity
                                ) >=
                                  Number(
                                    product.stock
                                  )
                              }
                            >
                              <FaPlus />
                            </button>

                          </div>

                          {/* ITEM TOTAL */}

                          <div className="cart-line-total">
                            Item total:{" "}
                            {formatPrice(
                              itemTotal
                            )}
                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() =>
                              handleRemove(
                                item.id
                              )
                            }
                            disabled={
                              updatingId ===
                              item.id
                            }
                          >
                            <FaTrash />

                            {updatingId ===
                            item.id
                              ? "Updating..."
                              : "Remove"}
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

              {/* CONTINUE SHOPPING */}

              <Link
                to="/products"
                className="back-shopping-link"
              >
                <FaArrowLeft />
                Continue Shopping
              </Link>

            </section>

            {/* ============================================================
                ORDER SUMMARY
            ============================================================ */}

            <aside className="order-summary">

              <h2>
                Order Summary
              </h2>

              {/* SUBTOTAL */}

              <div className="summary-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  {formatPrice(
                    subtotal
                  )}
                </strong>
              </div>

              {/* SHIPPING */}

              <div className="summary-row">
                <span>
                  Shipping
                </span>

                <strong
                  className={
                    shipping === 0
                      ? "text-success"
                      : ""
                  }
                >
                  {shipping === 0
                    ? "FREE"
                    : formatPrice(
                        shipping
                      )}
                </strong>
              </div>

              {/* FREE SHIPPING MESSAGE */}

              {amountForFreeShipping >
                0 && (
                <div className="free-shipping-note">
                  Spend{" "}
                  {formatPrice(
                    amountForFreeShipping
                  )}{" "}
                  more for free
                  shipping.
                </div>
              )}

              <div className="summary-divider"></div>

              {/* TOTAL */}

              <div className="summary-total">
                <span>
                  Total
                </span>

                <strong>
                  {formatPrice(
                    total
                  )}
                </strong>
              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                className="checkout-btn"
                onClick={() =>
                  navigate(
                    "/checkout"
                  )
                }
                disabled={
                  cartItems.length ===
                  0
                }
              >
                Proceed to Checkout
              </button>

              <p className="secure-checkout">
                Secure checkout powered
                by ShopEase
              </p>

            </aside>

          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;