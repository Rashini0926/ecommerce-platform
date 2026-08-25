import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getOrder } from "../services/orderService";

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;

function OrderSuccess() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!location.state?.order);
  const orderId = searchParams.get("order");

  useEffect(() => {
    if (order || !orderId) return;

    const loadOrder = async () => {
      try {
        const response = await getOrder(token, orderId);
        setOrder(response.order);
      } catch (error) {
        showToast(error.response?.data?.message || "Could not load order details.", "danger");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [order, orderId, showToast, token]);

  if (isLoading) return <main className="container py-5"><LoadingSpinner text="Loading order confirmation" /></main>;

  if (!order) return <main className="container py-5"><div className="card shadow-sm border-0 text-center p-5"><h2>Order not found</h2><p className="text-muted">Your order confirmation is unavailable.</p><Link to="/orders" className="btn btn-primary">View My Orders</Link></div></main>;

  return <main className="container py-5"><div className="card shadow-sm border-0 text-center p-5">
    <div className="mb-4"><div className="bg-success text-white rounded-circle d-inline-flex justify-content-center align-items-center" style={{ width: "80px", height: "80px", fontSize: "40px" }}>✓</div></div>
    <h2 className="fw-bold text-success">Order Placed Successfully!</h2>
    <p className="text-muted mt-3">Thank you for your purchase. Your order has been received and is being processed.</p>
    <div className="card bg-light border-0 mt-4 text-start"><div className="card-body"><h5>Order Details</h5><hr />
      <div className="d-flex justify-content-between mb-2"><span>Order Number</span><strong>#{order.order_number}</strong></div>
      <div className="d-flex justify-content-between mb-2"><span>Payment Method</span><strong>{order.payment_method === "CARD" ? "Card Payment (Demo)" : "Cash on Delivery"}</strong></div>
      <div className="d-flex justify-content-between mb-2"><span>Payment Status</span><strong className={order.payment_status === "PAID" ? "text-success" : "text-warning"}>{order.payment_status}</strong></div>
      <div className="d-flex justify-content-between"><span>Total Amount</span><strong className="text-primary">{formatPrice(order.total_amount)}</strong></div>
    </div></div>
    <div className="mt-4"><Link to="/orders" className="btn btn-primary me-2">View My Orders</Link><Link to="/products" className="btn btn-outline-secondary">Continue Shopping</Link></div>
  </div></main>;
}

export default OrderSuccess;
