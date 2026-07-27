import { FaCreditCard, FaShoppingCart, FaTruck } from "react-icons/fa";
import CartItem from "../components/cart/CartItem";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

function Cart() {
  const cart = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 12990,
      quantity: 1,
      image: "https://picsum.photos/100?random=1",
    },
    {
      id: 2,
      name: "Gaming Mouse",
      price: 5990,
      quantity: 2,
      image: "https://picsum.photos/100?random=2",
    },
  ];

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
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
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
