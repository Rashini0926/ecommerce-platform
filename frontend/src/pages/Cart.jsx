import { useEffect, useMemo, useState } from "react";
import { FaCreditCard, FaRegSadTear, FaShoppingCart, FaTruck } from "react-icons/fa";
import CartItem from "../components/cart/CartItem";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  getCart,
  removeFromCart,
  updateCartItem,
} from "../services/customerService";

function Cart() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);

      try {
        const response = await getCart(token);
        setCart(response.items || []);
      } catch (error) {
        showToast(
          error.response?.data?.message || "Failed to load cart.",
          "danger"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadCart();
    }
  }, [showToast, token]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
        0
      ),
    [cart]
  );

  const handleQuantityChange = async (item, quantity) => {
    setProcessingId(item.id);

    try {
      const response = await updateCartItem(token, item.id, quantity);
      setCart((currentItems) =>
        currentItems.map((cartItem) =>
          cartItem.id === item.id ? response.item : cartItem
        )
      );
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update cart item.",
        "danger"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (cartItemId) => {
    setProcessingId(cartItemId);

    try {
      await removeFromCart(token, cartItemId);
      setCart((currentItems) =>
        currentItems.filter((item) => item.id !== cartItemId)
      );
      showToast("Cart item removed.", "info");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to remove cart item.",
        "danger"
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <div className="page-header mb-4">
          <div>
            <span className="section-kicker">Review your order</span>
            <h2 className="mb-0 mt-2">
              <FaShoppingCart className="me-2 text-primary" />
              Shopping Cart
            </h2>
          </div>

          <span className="badge badge-soft-primary">
            {cart.length} items
          </span>
        </div>

        {isLoading ? (
          <div className="card glass-card empty-state">
            <LoadingSpinner text="Loading cart" />
          </div>
        ) : cart.length === 0 ? (
          <div className="card glass-card empty-state">
            <div className="empty-illustration mb-4">
              <FaRegSadTear size={42} />
            </div>

            <h4>Your cart is empty.</h4>
            <p className="text-muted">
              Add products to your cart and continue checkout when ready.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card glass-card">
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table cart-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th className="ps-4">Image</th>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Qty</th>
                          <th>Subtotal</th>
                          <th className="pe-4"></th>
                        </tr>
                      </thead>

                      <tbody>
                        {cart.map((item) => (
                          <CartItem
                            key={item.id}
                            item={item}
                            isProcessing={processingId === item.id}
                            onDecrease={(cartItem) =>
                              handleQuantityChange(cartItem, cartItem.quantity - 1)
                            }
                            onIncrease={(cartItem) =>
                              handleQuantityChange(cartItem, cartItem.quantity + 1)
                            }
                            onRemove={handleRemove}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card glass-card order-summary">
                <div className="card-body p-4">
                  <h4 className="mb-4">Order Summary</h4>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Subtotal</span>
                    <strong>Rs. {subtotal.toLocaleString()}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">
                      <FaTruck className="me-2 text-success" />
                      Delivery
                    </span>
                    <strong>Calculated at checkout</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Total</h5>
                    <h4 className="text-primary mb-0">
                      Rs. {subtotal.toLocaleString()}
                    </h4>
                  </div>

                  <button className="btn btn-success w-100 ripple pulse-button">
                    <FaCreditCard className="me-2" />
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
