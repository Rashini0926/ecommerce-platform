import { useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      seller: "Tech Store",
      price: 8500,
      quantity: 1,
      image: "https://picsum.photos/120?random=1",
    },
    {
      id: 2,
      name: "Gaming Mouse RGB",
      seller: "Gaming World",
      price: 4500,
      quantity: 2,
      image: "https://picsum.photos/120?random=2",
    },
  ]);

  const increaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-5">

      <h2 className="fw-bold mb-4">
        Shopping Cart
      </h2>

      <div className="row g-4">

        {/* Cart Items */}

        <div className="col-lg-8">

          {cartItems.map((item) => (

            <div
              key={item.id}
              className="card shadow-sm border-0 mb-3"
            >
              <div className="card-body">

                <div className="row align-items-center">

                  <div className="col-md-2 text-center">

                    <img
                      src={item.image}
                      className="img-fluid rounded"
                      alt={item.name}
                    />

                  </div>

                  <div className="col-md-4">

                    <h5>{item.name}</h5>

                    <small className="text-muted">
                      Sold by {item.seller}
                    </small>

                    <h6 className="text-primary mt-2">
                      Rs. {item.price.toLocaleString()}
                    </h6>

                  </div>

                  <div className="col-md-3">

                    <div className="input-group">

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>

                      <input
                        className="form-control text-center"
                        readOnly
                        value={item.quantity}
                      />

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <div className="col-md-2">

                    <strong>

                      Rs. {(item.price * item.quantity).toLocaleString()}

                    </strong>

                  </div>

                  <div className="col-md-1 text-end">

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      ✕
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* Order Summary */}

        <div className="col-lg-4">

          <div
            className="card shadow-sm border-0 sticky-top"
            style={{ top: "90px" }}
          >

            <div className="card-body">

              <h4 className="mb-4">
                Order Summary
              </h4>

              <div className="d-flex justify-content-between mb-2">

                <span>Subtotal</span>

                <strong>
                  Rs. {subtotal.toLocaleString()}
                </strong>

              </div>

              <div className="d-flex justify-content-between mb-2">

                <span>Shipping</span>

                <span className="text-success">
                  Free
                </span>

              </div>

              <div className="d-flex justify-content-between mb-3">

                <span>Discount</span>

                <span>Rs. 0</span>

              </div>

              <hr />

              <div className="d-flex justify-content-between">

                <h5>Total</h5>

                <h5 className="text-primary">
                  Rs. {subtotal.toLocaleString()}
                </h5>

              </div>

              <Link
                to="/checkout"
                className="btn btn-success w-100 mt-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="btn btn-outline-primary w-100 mt-2"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;