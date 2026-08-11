import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { cancelOrder, getOrders } from "../services/orderService";

const statusClasses = {
  PENDING: "bg-warning text-dark",
  PROCESSING: "bg-info text-dark",
  SHIPPED: "bg-primary",
  DELIVERED: "bg-success",
  CANCELLED: "bg-danger",
};

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;

function MyOrders() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const loadOrders = async () => {
    try {
      const response = await getOrders(token);
      setOrders(response.orders || []);
    } catch (error) {
      showToast(error.response?.data?.message || "Could not load your orders.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [token]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order? Stock will be returned to inventory.")) return;
    setCancellingId(orderId);
    try {
      const response = await cancelOrder(token, orderId);
      setOrders(orders.map((order) => order.id === orderId ? response.order : order));
      showToast("Order cancelled successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not cancel this order.", "danger");
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) return <main className="container py-5"><LoadingSpinner text="Loading your orders" /></main>;

  return <main className="container py-5"><div className="d-flex justify-content-between align-items-center mb-4"><div><h2 className="fw-bold mb-1">My Orders</h2><p className="text-muted mb-0">Track and manage your purchases.</p></div><Link to="/products" className="btn btn-outline-primary">Continue Shopping</Link></div>
    {!orders.length ? <div className="card shadow-sm border-0 text-center p-5"><h4>No orders yet</h4><p className="text-muted">Your completed checkout orders will appear here.</p><Link to="/products" className="btn btn-primary">Start Shopping</Link></div> : orders.map((order) => <div key={order.id} className="card shadow-sm border-0 mb-4"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-start gap-3"><div><h5 className="mb-1">Order #{order.order_number}</h5><small className="text-muted">Placed on {new Date(order.created_at).toLocaleDateString("en-LK", { year: "numeric", month: "long", day: "numeric" })}</small></div><span className={`badge ${statusClasses[order.order_status] || "bg-secondary"} px-3 py-2`}>{order.order_status}</span></div><hr />
      {order.items?.slice(0, 2).map((item) => <div key={item.id} className="d-flex align-items-center mb-3"><img className="bg-light rounded me-3 object-fit-cover" width="56" height="56" src={item.product?.image || "https://via.placeholder.com/56?text=Product"} alt="" /><div className="flex-grow-1"><h6 className="mb-1">{item.product_name}</h6><small className="text-muted">Quantity: {item.quantity}</small></div><strong>{formatPrice(item.subtotal)}</strong></div>)}
      {(order.items?.length || 0) > 2 && <small className="text-muted">+ {order.items.length - 2} more item(s)</small>}<hr /><div className="d-flex justify-content-between align-items-center"><div><span className="text-muted d-block small">Payment: {order.payment_method === "CARD" ? "Card (Demo)" : "Cash on Delivery"} · {order.payment_status}</span><h5 className="text-primary mb-0 mt-1">{formatPrice(order.total_amount)}</h5></div><div className="d-flex gap-2"><Link className="btn btn-primary" to={`/orders/${order.id}`}>View Details</Link>{order.order_status === "PROCESSING" && <button className="btn btn-outline-danger" disabled={cancellingId === order.id} onClick={() => handleCancel(order.id)}>{cancellingId === order.id ? "Cancelling..." : "Cancel Order"}</button>}</div></div>
    </div></div>)}</main>;
}

export default MyOrders;
