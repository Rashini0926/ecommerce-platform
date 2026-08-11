import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAdminOrders, updateOrderStatus } from "../services/orderService";

const statuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;

function AdminOrders() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try { const response = await getAdminOrders(token); setOrders(response.orders || []); }
      catch (error) { showToast(error.response?.data?.message || "Could not load platform orders.", "danger"); }
      finally { setIsLoading(false); }
    };
    loadOrders();
  }, [showToast, token]);

  const changeStatus = async (order, orderStatus) => {
    if (orderStatus === order.order_status) return;
    setUpdatingId(order.id);
    try {
      const response = await updateOrderStatus(token, order.id, orderStatus);
      setOrders(orders.map((item) => item.id === order.id ? response.order : item));
      showToast("Order status updated.", "success");
    } catch (error) { showToast(error.response?.data?.message || "Could not update order status.", "danger"); }
    finally { setUpdatingId(null); }
  };

  return <div className="app-page"><Navbar /><main className="container py-5"><div className="d-flex justify-content-between align-items-center mb-4"><div><span className="section-kicker">Administration</span><h1 className="mt-2">Order Management</h1></div><Link to="/admin/dashboard" className="btn btn-outline-danger">Admin Dashboard</Link></div>
    {isLoading ? <LoadingSpinner text="Loading platform orders" /> : !orders.length ? <div className="card shadow-sm border-0 text-center p-5"><h4>No orders yet</h4></div> : <div className="card shadow-sm border-0"><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Payment</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.order_number}</strong><small className="d-block text-muted">{new Date(order.created_at).toLocaleDateString("en-LK")}</small></td><td><strong>{order.user?.full_name}</strong><small className="d-block text-muted">{order.user?.email}<br />{order.user?.phone}</small></td><td>{order.items?.map((item) => <small className="d-block" key={item.id}>{item.product_name} × {item.quantity}</small>)}</td><td>{order.payment_method === "CARD" ? "Card (Demo)" : "COD"}<small className={`d-block ${order.payment_status === "PAID" ? "text-success" : "text-warning"}`}>{order.payment_status}</small></td><td><strong>{formatPrice(order.total_amount)}</strong></td><td><select className="form-select form-select-sm" disabled={updatingId === order.id || order.order_status === "CANCELLED"} value={order.order_status} onChange={(event) => changeStatus(order, event.target.value)}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></div>}
  </main><Footer /></div>;
}

export default AdminOrders;
