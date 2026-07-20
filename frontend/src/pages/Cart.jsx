import CartItem from "../components/cart/CartItem";

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
    <div className="container py-5">

      <h2 className="mb-4">
        🛒 Shopping Cart
      </h2>

      <div className="table-responsive">

        <table className="table align-middle">

          <thead>

            <tr>

              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th></th>

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

      <div className="card mt-4 shadow-sm">

        <div className="card-body">

          <h4>

            Total :
            <span className="text-primary ms-2">
              Rs. {subtotal.toLocaleString()}
            </span>

          </h4>

          <button className="btn btn-success mt-3">
            Proceed to Checkout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;