import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getOrder, getOrderTracking } from "../services/orderService";
import { productImageSource, useProductImageFallback } from "../utils/productImage";

const stages = ["PROCESSING", "SHIPPED", "DELIVERED"];
const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;
const formatDate = (date) => date ? new Date(date).toLocaleString("en-LK") : "Pending";
const readableStatus = (status) => status?.replaceAll("_", " ") || "PROCESSING";

function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const [orderResponse, trackingResponse] = await Promise.all([
          getOrder(token, id),
          getOrderTracking(token, id),
        ]);
        setOrder(orderResponse.order);
        setTracking(trackingResponse.tracking);
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

  const orderStatus = tracking?.order_status || order.order_status;
  const currentStage = stages.indexOf(orderStatus);
  const isCancelled = orderStatus === "CANCELLED";

  return <main className="container py-5">
    <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
      <div>
        <Link to="/orders" className="text-decoration-none">&larr; My Orders</Link>
        <h1 className="h2 fw-bold mt-2 mb-1">Order #{order.order_number}</h1>
        <p className="text-muted mb-0">Placed {formatDate(order.created_at)}</p>
      </div>
      <span className={`badge ${isCancelled ? "text-bg-danger" : "text-bg-primary"} px-3 py-2`}>{readableStatus(orderStatus)}</span>
    </div>

    <div className="row g-4">
      <div className="col-lg-8">
        <section className="card shadow-sm border-0 mb-4"><div className="card-body p-4">
          <h2 className="h5 mb-4">Delivery tracking</h2>
          {isCancelled ? <div className="alert alert-danger mb-0">This order was cancelled.</div> : <>
            <div className="row g-3">{stages.map((stage, index) => <div className="col-4 text-center" key={stage}><div className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${index <= currentStage ? "bg-success text-white" : "bg-light text-muted"}`} style={{ width: 38, height: 38 }}>{index + 1}</div><small className={index <= currentStage ? "fw-semibold text-success" : "text-muted"}>{readableStatus(stage)}</small></div>)}</div>
            {(tracking?.courier_name || tracking?.tracking_number) && <div className="alert alert-light border mt-4 mb-0"><div className="fw-semibold mb-1">Shipment information</div>{tracking.courier_name && <div>Courier: {tracking.courier_name}</div>}{tracking.tracking_number && <div>Tracking number: <strong>{tracking.tracking_number}</strong></div>}<small className="text-muted d-block mt-2">Shipped: {formatDate(tracking.shipped_at)} · Delivered: {formatDate(tracking.delivered_at)}</small></div>}
          </>}
        </div></section>
        <section className="card shadow-sm border-0"><div className="card-body p-4"><h2 className="h5 mb-4">Items ordered</h2>{order.items.map((item) => <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3" key={item.id}><img className="rounded object-fit-cover" width="72" height="72" src={productImageSource(item.product?.image)} onError={useProductImageFallback} alt={item.product_name} /><div className="flex-grow-1"><h3 className="h6 mb-1">{item.product_name}</h3><small className="text-muted">{formatPrice(item.unit_price)} × {item.quantity}</small></div><strong>{formatPrice(item.subtotal)}</strong></div>)}</div></section>
      </div>
      <aside className="col-lg-4">
        <section className="card shadow-sm border-0 mb-4"><div className="card-body p-4"><h2 className="h5 mb-3">Payment summary</h2><div className="d-flex justify-content-between mb-2"><span>Method</span><strong>{order.payment_method === "CARD" ? "Card (Demo)" : "Cash on Delivery"}</strong></div><div className="d-flex justify-content-between mb-3"><span>Payment</span><strong className={order.payment_status === "PAID" ? "text-success" : "text-warning"}>{order.payment_status}</strong></div><hr /><div className="d-flex justify-content-between"><strong>Total</strong><strong className="text-primary">{formatPrice(order.total_amount)}</strong></div></div></section>
        <section className="card shadow-sm border-0"><div className="card-body p-4"><h2 className="h5 mb-3">Delivery address</h2><p className="mb-0 text-muted" style={{ whiteSpace: "pre-line" }}>{order.shipping_address}</p></div></section>
      </aside>
    </div>
  </main>;
}

export default OrderDetails;
