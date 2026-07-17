import { Link } from "react-router-dom";

function MyOrders() {
  const orders = [
    {
      id: "ORD10234",
      date: "17 July 2026",
      status: "Pending",
      total: 17500,
      items: [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones",
          quantity: 1,
          image: null,
        },
        {
          id: 2,
          name: "Gaming Mouse RGB",
          quantity: 2,
          image: null,
        },
      ],
    },
    {
      id: "ORD10218",
      date: "12 July 2026",
      status: "Delivered",
      total: 9500,
      items: [
        {
          id: 3,
          name: "Mechanical Keyboard",
          quantity: 1,
          image: null,
        },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";
      case "Processing":
        return "bg-info";
      case "Shipped":
        return "bg-primary";
      case "Delivered":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Orders</h2>

        <Link
          to="/products"
          className="btn btn-outline-primary"
        >
          Continue Shopping
        </Link>
      </div>

      {orders.map((order) => (
        <div
          key={order.id}
          className="card shadow-sm border-0 mb-4"
        >
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center">

              <div>

                <h5 className="mb-1">
                  Order #{order.id}
                </h5>

                <small className="text-muted">
                  Placed on {order.date}
                </small>

              </div>

              <span
                className={`badge ${getStatusBadge(order.status)} px-3 py-2`}
              >
                {order.status}
              </span>

            </div>

            <hr />

            {order.items.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center mb-3"
              >

                <div
                  className="bg-light rounded me-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "70px",
                    height: "70px",
                  }}
                >
                  {/* Product image goes here later */}
                </div>

                <div className="flex-grow-1">

                  <h6 className="mb-1">
                    {item.name}
                  </h6>

                  <small className="text-muted">
                    Quantity: {item.quantity}
                  </small>

                </div>

              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between align-items-center">

              <h5 className="mb-0">
                Total
              </h5>

              <h5 className="text-primary mb-0">
                Rs. {order.total.toLocaleString()}
              </h5>

            </div>

            <div className="mt-4 d-flex gap-2">

              <button className="btn btn-primary">
                View Details
              </button>

              {order.status === "Pending" && (
                <button className="btn btn-outline-danger">
                  Cancel Order
                </button>
              )}

            </div>

          </div>
        </div>
      ))}

    </div>
  );
}

export default MyOrders;