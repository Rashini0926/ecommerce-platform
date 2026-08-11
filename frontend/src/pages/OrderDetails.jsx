import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getOrder } from "../services/orderService";

const stages = ["PROCESSING", "SHIPPED", "DELIVERED"];
const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;

function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await getOrder(token, id);
        setOrder(response.order);
      } catch (error) {
        showToast(error.response?.data?.message || "Could not load this order.", "danger");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrder();
  }, [id, showToast, token]);

  if (isLoading) return <main className="container py-5"><LoadingSpinner text="Loading order details" /></main>;
  if (!order) return <main className="container py-5"><div className="alert alert-warning">Order not found. <Link to="/orders">Return to My Orders</Link></div></main>;

  const currentStage = stages.indexOf(order.order_status);
  const isCancelled = order.order_status === "CANCELLED";

  return <main className="container py-5"><div className="d-flex justify-content-between align-items-start mb-4"><div><Link to="/orders" className="text-decoration-none">← My Orders</Link><h2 className="fw-bold mt-2 mb-1">Order #{order.order_number}</h2><p className="text-muted mb-0">Placed {new Date(order.created_at).toLocaleString("en-LK")}</p></div><span className={`badge ${isCancelled ? "bg-danger" : "bg-primary"} px-3 py-2`}>{order.order_status}</span></div>
    <div className="row g-4"><div className="col-lg-8"><div className="card shadow-sm border-0 mb-4"><div className="card-body p-4"><h5 className="mb-4">Delivery Tracking</h5>{isCancelled ? <div className="alert alert-danger mb-0">This order was cancelled.</div> : <div className="d-flex justify-content-between position-relative">{stages.map((stage, index) => <div className="text-center flex-fill" key={stage}><div className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${index <= currentStage ? "bg-success text-white" : "bg-light text-muted"}`} style={{ width: 36, height: 36 }}>{index + 1}</div><small className={index <= currentStage ? "fw-bold text-success" : "text-muted"}>{stage.charAt(0) + stage.slice(1).toLowerCase()}</small></div>)}</div>}</div></div>
      <div className="card shadow-sm border-0"><div className="card-body p-4"><h5 className="mb-4">Items Ordered</h5>{order.items.map((item) => <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3" key={item.id}><img className="rounded object-fit-cover" width="72" height="72" src={item.product?.image || "https://via.placeholder.com/72?text=Product"} alt="" /><div className="flex-grow-1"><h6 className="mb-1">{item.product_name}</h6><small className="text-muted">{formatPrice(item.unit_price)} × {item.quantity}</small></div><strong>{formatPrice(item.subtotal)}</strong></div>)}</div></div></div>
      <div className="col-lg-4"><div className="card shadow-sm border-0 mb-4"><div className="card-body p-4"><h5 className="mb-3">Payment Summary</h5><div className="d-flex justify-content-between mb-2"><span>Method</span><strong>{order.payment_method === "CARD" ? "Card (Demo)" : "Cash on Delivery"}</strong></div><div className="d-flex justify-content-between mb-3"><span>Payment</span><strong className={order.payment_status === "PAID" ? "text-success" : "text-warning"}>{order.payment_status}</strong></div><hr /><div className="d-flex justify-content-between"><strong>Total</strong><strong className="text-primary">{formatPrice(order.total_amount)}</strong></div></div></div><div className="card shadow-sm border-0"><div className="card-body p-4"><h5 className="mb-3">Delivery Address</h5><p className="mb-0 text-muted" style={{ whiteSpace: "pre-line" }}>{order.shipping_address}</p></div></div></div>
    </div></main>;
}

export default OrderDetails;
