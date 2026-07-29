import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTruck,
} from "react-icons/fa";

const orders = [
  {
    id: "SE-10021",
    item: "Wireless Headphones",
    date: "28 Jul 2026",
    amount: "Rs. 8,500",
    status: "Processing",
    icon: <FaClock />,
    color: "primary",
  },
  {
    id: "SE-10018",
    item: "Smart Watch",
    date: "24 Jul 2026",
    amount: "Rs. 12,000",
    status: "Shipped",
    icon: <FaTruck />,
    color: "success",
  },
  {
    id: "SE-10011",
    item: "Laptop Backpack",
    date: "20 Jul 2026",
    amount: "Rs. 4,500",
    status: "Delivered",
    icon: <FaCheckCircle />,
    color: "success",
  },
];

function RecentOrders() {
  return (
    <div className="card glass-card h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div>
            <span className="section-kicker">Order activity</span>
            <h4 className="mb-0 mt-2">Recent Orders</h4>
          </div>

          <span className="badge badge-soft-primary">
            <FaBox className="me-2" />
            Tracking ready
          </span>
        </div>

        <div className="table-responsive">
          <table className="table dashboard-orders-table align-middle mb-0">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold">{order.id}</td>
                  <td>{order.item}</td>
                  <td>{order.date}</td>
                  <td className="fw-bold">{order.amount}</td>
                  <td>
                    <span className={`badge badge-soft-${order.color}`}>
                      {order.icon}
                      <span className="ms-2">{order.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RecentOrders;
