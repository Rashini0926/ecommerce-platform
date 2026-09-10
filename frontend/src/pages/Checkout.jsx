import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import { getCart } from "../services/customerService";
import { createOrder } from "../services/orderService";
import api from "../utils/api";

/*
|--------------------------------------------------------------------------
| CHECKOUT SETTINGS
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

/*
|--------------------------------------------------------------------------
| PRODUCT IMAGE HELPER
|--------------------------------------------------------------------------
*/

const getImageUrl = (product) => {
  if (!product?.image) {
    return "/images/products/placeholder.svg";
  }

  const image = String(product.image).trim();

  /*
  |--------------------------------------------------------------------------
  | FULL URL
  |--------------------------------------------------------------------------
  */

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  /*
  |--------------------------------------------------------------------------
  | LARAVEL STORAGE
  |--------------------------------------------------------------------------
  */

  if (image.startsWith("storage/")) {
    return `http://127.0.0.1:8000/${image}`;
  }

  if (image.startsWith("/storage/")) {
    return `http://127.0.0.1:8000${image}`;
  }

  /*
  |--------------------------------------------------------------------------
  | FRONTEND PRODUCT IMAGE
  |--------------------------------------------------------------------------
  */

  if (image.startsWith("images/products/")) {
    return `/${image}`;
  }

  if (image.startsWith("/images/products/")) {
    return image;
  }

  /*
  |--------------------------------------------------------------------------
  | ONLY FILE NAME
  |--------------------------------------------------------------------------
  */

  return `/images/products/${image}`;
};

function Checkout() {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [cartItems, setCartItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: user?.full_name || "",
    phone: user?.phone || "",
    city: "",
    address: "",
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD CART + ADDRESSES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setIsLoading(true);

        const [
          cartResponse,
          addressResponse,
        ] = await Promise.all([
          getCart(token),

          api.get("/addresses", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        /*
        |--------------------------------------------------------------------------
        | CART ITEMS
        |--------------------------------------------------------------------------
        */

        const items =
          cartResponse?.items ||
          cartResponse?.cart ||
          cartResponse?.cart_items ||
          (Array.isArray(cartResponse)
            ? cartResponse
            : []);

        setCartItems(items);

        /*
        |--------------------------------------------------------------------------
        | SAVED ADDRESSES
        |--------------------------------------------------------------------------
        */

        const savedAddresses =
          addressResponse?.data?.addresses ||
          [];

        setAddresses(savedAddresses);
      } catch (error) {
        console.error(
          "Checkout loading error:",
          error
        );

        showToast(
          error.response?.data?.message ||
            "Could not load your checkout information.",
          "danger"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadCheckoutData();
    } else {
      setIsLoading(false);
    }
  }, [token, showToast]);

  /*
  |--------------------------------------------------------------------------
  | SUBTOTAL
  |--------------------------------------------------------------------------
  */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const price = Number(
          item.product?.price || 0
        );

        const quantity = Number(
          item.quantity || 1
        );

        return total + price * quantity;
      },
      0
    );
  }, [cartItems]);

  /*
  |--------------------------------------------------------------------------
  | SHIPPING
  |--------------------------------------------------------------------------
  |
  | subtotal < Rs. 100
  |     => Rs. 10.00
  |
  | subtotal >= Rs. 100
  |     => FREE
  |
  */

  const shipping =
    subtotal > 0
      ? subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_FEE
      : 0;

  /*
  |--------------------------------------------------------------------------
  | AMOUNT REQUIRED FOR FREE SHIPPING
  |--------------------------------------------------------------------------
  */

  const amountForFreeShipping =
    subtotal > 0 &&
    subtotal < FREE_SHIPPING_THRESHOLD
      ? FREE_SHIPPING_THRESHOLD - subtotal
      : 0;

  /*
  |--------------------------------------------------------------------------
  | FINAL TOTAL
  |--------------------------------------------------------------------------
  */

  const total = subtotal + shipping;

  /*
  |--------------------------------------------------------------------------
  | UPDATE DELIVERY DETAILS
  |--------------------------------------------------------------------------
  */

  const updateDeliveryDetail = (event) => {
    const {
      name,
      value,
    } = event.target;

    setDeliveryDetails(
      (previousDetails) => ({
        ...previousDetails,
        [name]: value,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT SAVED ADDRESS
  |--------------------------------------------------------------------------
  */

  const selectAddress = (address) => {
    setDeliveryDetails({
      fullName:
        address.recipient_name ||
        user?.full_name ||
        "",

      phone:
        address.phone ||
        user?.phone ||
        "",

      city:
        address.city ||
        "",

      address:
        address.address ||
        "",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | PLACE ORDER
  |--------------------------------------------------------------------------
  */

  const placeOrder = async () => {
    /*
    |--------------------------------------------------------------------------
    | VALIDATE DELIVERY DETAILS
    |--------------------------------------------------------------------------
    */

    const hasEmptyField =
      Object.values(
        deliveryDetails
      ).some(
        (value) =>
          !String(
            value || ""
          ).trim()
      );

    if (hasEmptyField) {
      showToast(
        "Please complete all delivery information.",
        "danger"
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE SHIPPING ADDRESS STRING
    |--------------------------------------------------------------------------
    */

    const shippingAddress = [
      deliveryDetails.fullName,
      deliveryDetails.phone,
      deliveryDetails.address,
      deliveryDetails.city,
    ].join(", ");

    try {
      setIsSubmitting(true);

      /*
      |--------------------------------------------------------------------------
      | CREATE ORDER
      |--------------------------------------------------------------------------
      */

      const response =
        await createOrder(
          token,
          {
            shipping_address:
              shippingAddress,

            payment_method:
              paymentMethod,
          }
        );

      /*
      |--------------------------------------------------------------------------
      | UPDATE CART BADGE
      |--------------------------------------------------------------------------
      */

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      showToast(
        "Order placed successfully.",
        "success"
      );

      navigate(
        `/order-success?order=${response.order.id}`,
        {
          state: {
            order:
              response.order,
          },
        }
      );
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      const validationErrors =
        error.response?.data?.errors;

      const message =
        validationErrors
          ? Object.values(
              validationErrors
            )
              .flat()[0]
          : error.response?.data?.message ||
            "Could not place your order. Please try again.";

      showToast(
        message,
        "danger"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <main className="container py-5">
        <LoadingSpinner text="Loading checkout" />
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | EMPTY CART
  |--------------------------------------------------------------------------
  */

  if (!cartItems.length) {
    return (
      <main className="container py-5">
        <div className="card shadow-sm border-0 text-center p-5">

          <h2>
            Your cart is empty
          </h2>

          <p className="text-muted">
            Add products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
          >
            Browse Products
          </Link>

        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | CHECKOUT PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <main className="container py-5">

      {/* ================================================================
          PAGE TITLE
      ================================================================ */}

      <h2 className="fw-bold mb-4">
        Checkout
      </h2>

      <div className="row g-4">

        {/* ==============================================================
            LEFT SIDE
        ============================================================== */}

        <div className="col-lg-7">

          {/* ============================================================
              DELIVERY INFORMATION
          ============================================================ */}

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <h4 className="mb-4">
                Delivery Information
              </h4>

              {/* ========================================================
                  SAVED ADDRESS
              ======================================================== */}

              {addresses.length > 0 && (
                <div className="mb-3">

                  <label className="form-label">
                    Saved address
                  </label>

                  <select
                    className="form-select"
                    defaultValue=""
                    onChange={(event) => {
                      const selectedAddress =
                        addresses.find(
                          (address) =>
                            address.id ===
                            Number(
                              event.target.value
                            )
                        );

                      if (selectedAddress) {
                        selectAddress(
                          selectedAddress
                        );
                      }
                    }}
                  >

                    <option value="">
                      Enter a new address
                    </option>

                    {addresses.map(
                      (address) => (
                        <option
                          key={address.id}
                          value={address.id}
                        >
                          {address.label ||
                            "Address"}{" "}
                          —{" "}
                          {address.address}
                        </option>
                      )
                    )}

                  </select>

                </div>
              )}

              {/* ========================================================
                  DELIVERY FORM
              ======================================================== */}

              <div className="row g-3">

                {/* FULL NAME */}

                <div className="col-md-6">

                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    required
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={
                      deliveryDetails.fullName
                    }
                    onChange={
                      updateDeliveryDetail
                    }
                  />

                </div>

                {/* PHONE */}

                <div className="col-md-6">

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    required
                    type="text"
                    name="phone"
                    className="form-control"
                    value={
                      deliveryDetails.phone
                    }
                    onChange={
                      updateDeliveryDetail
                    }
                  />

                </div>

                {/* CITY */}

                <div className="col-12">

                  <label className="form-label">
                    City
                  </label>

                  <input
                    required
                    type="text"
                    name="city"
                    className="form-control"
                    value={
                      deliveryDetails.city
                    }
                    onChange={
                      updateDeliveryDetail
                    }
                  />

                </div>

                {/* DELIVERY ADDRESS */}

                <div className="col-12">

                  <label className="form-label">
                    Delivery Address
                  </label>

                  <textarea
                    required
                    name="address"
                    className="form-control"
                    rows="4"
                    value={
                      deliveryDetails.address
                    }
                    onChange={
                      updateDeliveryDetail
                    }
                  />

                </div>

              </div>

            </div>

          </div>

          {/* ============================================================
              PAYMENT METHOD
          ============================================================ */}

          <div className="card shadow-sm border-0 mt-4">

            <div className="card-body p-4">

              <h4 className="mb-3">
                Payment Method
              </h4>

              {/* CASH ON DELIVERY */}

              <div className="form-check mb-3">

                <input
                  className="form-check-input"
                  id="cod"
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={
                    paymentMethod ===
                    "COD"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="cod"
                >

                  <strong>
                    Cash on Delivery
                  </strong>

                  <small className="d-block text-muted">
                    Pay when your order is delivered.
                  </small>

                </label>

              </div>

              {/* CARD PAYMENT */}

              <div className="form-check">

                <input
                  className="form-check-input"
                  id="card"
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={
                    paymentMethod ===
                    "CARD"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                />

                <label
                  className="form-check-label"
                  htmlFor="card"
                >

                  <strong>
                    Card Payment (Demo)
                  </strong>

                  <small className="d-block text-muted">
                    A simulated successful payment for this academic project.
                  </small>

                </label>

              </div>

            </div>

          </div>

        </div>

        {/* ==============================================================
            RIGHT SIDE
        ============================================================== */}

        <div className="col-lg-5">

          <div
            className="card shadow-sm border-0 sticky-top"
            style={{
              top: "90px",
            }}
          >

            <div className="card-body p-4">

              <h4 className="mb-4">
                Order Summary
              </h4>

              {/* ========================================================
                  PRODUCTS
              ======================================================== */}

              {cartItems.map(
                (item) => {
                  const itemTotal =
                    Number(
                      item.product?.price ||
                        0
                    ) *
                    Number(
                      item.quantity ||
                        1
                    );

                  return (
                    <div
                      key={item.id}
                      className="d-flex align-items-center mb-3"
                    >

                      {/* IMAGE */}

                      <img
                        className="rounded me-3 object-fit-cover"
                        width="64"
                        height="64"
                        src={
                          getImageUrl(
                            item.product
                          )
                        }
                        alt={
                          item.product?.name ||
                          "Product"
                        }
                        onError={(event) => {
                          event.currentTarget.onerror =
                            null;

                          event.currentTarget.src =
                            "/images/products/placeholder.svg";
                        }}
                      />

                      {/* PRODUCT DETAILS */}

                      <div className="flex-grow-1">

                        <h6 className="mb-1">
                          {item.product?.name ||
                            "Product"}
                        </h6>

                        <small className="text-muted">
                          Quantity:{" "}
                          {item.quantity}
                        </small>

                      </div>

                      {/* ITEM TOTAL */}

                      <strong>
                        {formatPrice(
                          itemTotal
                        )}
                      </strong>

                    </div>
                  );
                }
              )}

              <hr />

              {/* ========================================================
                  SUBTOTAL
              ======================================================== */}

              <div className="d-flex justify-content-between mb-2">

                <span>
                  Subtotal
                </span>

                <strong>
                  {formatPrice(
                    subtotal
                  )}
                </strong>

              </div>

              {/* ========================================================
                  SHIPPING
              ======================================================== */}

              <div className="d-flex justify-content-between mb-2">

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
                    ? "Free"
                    : formatPrice(
                        shipping
                      )}
                </strong>

              </div>

              {/* ========================================================
                  FREE SHIPPING MESSAGE
              ======================================================== */}

              {amountForFreeShipping >
                0 && (
                <div
                  className="alert alert-primary py-2 px-3 mt-3 mb-3"
                  style={{
                    fontSize:
                      "13px",
                  }}
                >
                  Spend{" "}
                  <strong>
                    {formatPrice(
                      amountForFreeShipping
                    )}
                  </strong>{" "}
                  more for free shipping.
                </div>
              )}

              <hr />

              {/* ========================================================
                  FINAL TOTAL
              ======================================================== */}

              <div className="d-flex justify-content-between align-items-center">

                <h5 className="mb-0">
                  Total
                </h5>

                <h5 className="text-primary mb-0">
                  {formatPrice(
                    total
                  )}
                </h5>

              </div>

              {/* ========================================================
                  PLACE ORDER
              ======================================================== */}

              <button
                className="btn btn-success w-100 mt-4"
                type="button"
                disabled={
                  isSubmitting
                }
                onClick={
                  placeOrder
                }
              >
                {isSubmitting
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

              {/* ========================================================
                  BACK TO CART
              ======================================================== */}

              <Link
                to="/cart"
                className="btn btn-outline-secondary w-100 mt-2"
              >
                Back to Cart
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Checkout;