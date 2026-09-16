import { Link } from "react-router-dom";
import { FaBox, FaCheckCircle, FaClock, FaTimesCircle, FaTruck } from "react-icons/fa";

const statusDetails = {
  PENDING: { icon: <FaClock />, color: "warning" },
  PROCESSING: { icon: <FaClock />, color: "primary" },
  SHIPPED: { icon: <FaTruck />, color: "primary" },
  DELIVERED: { icon: <FaCheckCircle />, color: "success" },
  CANCELLED: { icon: <FaTimesCircle />, color: "danger" },
};

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="card glass-card h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div><span className="section-kicker">Order activity</span><h2 className="h4 mb-0 mt-2">Recent orders</h2></div>
          <Link className="btn btn-sm btn-outline-primary" to="/orders"><FaBox className="me-2" />View all orders</Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-muted py-5"><FaBox className="fs-2 mb-3" /><p className="mb-2">You have not placed an order yet.</p><Link to="/products">Browse products</Link></div>
        ) : (
          <div className="table-responsive">
            <table className="table dashboard-orders-table align-middle mb-0">
              <thead><tr><th>Order</th><th>Products</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map((order) => {
                  const status = statusDetails[order.order_status] || statusDetails.PENDING;
                  return (
                    <tr key={order.id}>
                      <td><Link className="fw-bold text-decoration-none" to={`/orders/${order.id}`}>{order.order_number}</Link></td>
                      <td>{order.items?.[0]?.product_name || "Order items"}{order.items?.length > 1 && <small className="text-muted ms-1">+{order.items.length - 1}</small>}</td>
                      <td>{new Date(order.created_at).toLocaleDateString("en-LK")}</td>
                      <td className="fw-bold">{formatPrice(order.total_amount)}</td>
                      <td><span className={`badge badge-soft-${status.color}`}>{status.icon}<span className="ms-2">{order.order_status}</span></span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
