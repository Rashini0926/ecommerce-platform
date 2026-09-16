import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getAdminOrders, updateOrderStatus, updateShipping } from "../services/orderService";

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;
const statusOptionsFor = (order) => {
  if (order.order_status === "PENDING") return ["PENDING", "PROCESSING", "CANCELLED"];
  if (order.order_status === "PROCESSING") return order.payment_status === "PAID" ? ["PROCESSING"] : ["PROCESSING", "CANCELLED"];
  if (order.order_status === "SHIPPED") return ["SHIPPED", "DELIVERED"];
  return [order.order_status];
};
const canDispatch = (order) => !["DELIVERED", "CANCELLED"].includes(order.order_status)
  && (order.payment_method !== "CARD" || order.payment_status === "PAID");

function AdminOrders() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [shippingOrder, setShippingOrder] = useState(null);
  const [shippingForm, setShippingForm] = useState({ courier_name: "", tracking_number: "", shipping_fee: "0" });
  const [filters, setFilters] = useState({ search: "", order_status: "", payment_status: "" });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const response = await getAdminOrders(token, { ...appliedFilters, page });
        setOrders(response.orders || []);
        setMeta(response.meta || { current_page: 1, last_page: 1, total: response.orders?.length || 0 });
      } catch (error) {
        showToast(error.response?.data?.message || "Could not load platform orders.", "danger");
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [appliedFilters, page, showToast, token]);

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    const emptyFilters = { search: "", order_status: "", payment_status: "" };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  const replaceOrder = (updatedOrder) => setOrders((current) => current.map((item) => item.id === updatedOrder.id ? updatedOrder : item));

  const changeStatus = async (order, orderStatus) => {
    if (orderStatus === order.order_status) return;
    setUpdatingId(order.id);
    try {
      const response = await updateOrderStatus(token, order.id, orderStatus);
      replaceOrder(response.order);
      showToast("Order status updated.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not update order status.", "danger");
    } finally {
      setUpdatingId(null);
    }
  };

  const openShipping = (order) => {
    setShippingOrder(order);
    setShippingForm({
      courier_name: order.courier_name || "",
      tracking_number: order.tracking_number || "",
      shipping_fee: order.shipping_fee || "0",
    });
  };

  const submitShipping = async (event) => {
    event.preventDefault();
    if (!shippingOrder) return;
    setUpdatingId(shippingOrder.id);
    try {
      const response = await updateShipping(token, shippingOrder.id, shippingForm);
      replaceOrder(response.order);
      setShippingOrder(null);
      showToast("Shipping details saved and customer notified.", "success");
    } catch (error) {
      const errors = error.response?.data?.errors;
      const message = errors ? Object.values(errors).flat()[0] : error.response?.data?.message;
      showToast(message || "Could not save shipping details.", "danger");
    } finally {
      setUpdatingId(null);
    }
  };

  return <div className="app-page">
    <Navbar />
    <main className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div><span className="section-kicker">Administration</span><h1 className="mt-2 mb-1">Order management</h1><p className="text-muted mb-0">Manage order progress and dispatch customer shipments.</p></div>
        <Link to="/admin/dashboard" className="btn btn-outline-danger">Admin Dashboard</Link>
      </div>

      <form className="card border-0 shadow-sm mb-4" onSubmit={applyFilters}>
        <div className="card-body p-3 p-lg-4">
          <div className="row g-3 align-items-end">
            <div className="col-lg-5"><label className="form-label" htmlFor="order-search">Search orders</label><input id="order-search" className="form-control" placeholder="Order number, customer, or email" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></div>
            <div className="col-sm-6 col-lg-2"><label className="form-label" htmlFor="order-status">Order status</label><select id="order-status" className="form-select" value={filters.order_status} onChange={(event) => setFilters({ ...filters, order_status: event.target.value })}><option value="">All statuses</option><option value="PROCESSING">Processing</option><option value="SHIPPED">Shipped</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option></select></div>
            <div className="col-sm-6 col-lg-2"><label className="form-label" htmlFor="payment-status">Payment</label><select id="payment-status" className="form-select" value={filters.payment_status} onChange={(event) => setFilters({ ...filters, payment_status: event.target.value })}><option value="">All payments</option><option value="PENDING">Pending</option><option value="PAID">Paid</option></select></div>
            <div className="col-lg-3 d-flex gap-2"><button className="btn btn-primary flex-grow-1">Apply filters</button><button className="btn btn-outline-secondary" onClick={clearFilters} type="button">Clear</button></div>
          </div>
        </div>
      </form>

      {isLoading ? <LoadingSpinner text="Loading platform orders" /> : !orders.length ? <div className="card shadow-sm border-0 text-center p-5"><h2 className="h4">No matching orders</h2><p className="text-muted mb-0">Try changing the filters or wait for new orders.</p></div> : <><div className="card shadow-sm border-0"><div className="card-header bg-transparent border-0 px-4 pt-4"><small className="text-muted">{meta.total} order{meta.total === 1 ? "" : "s"} found</small></div><div className="table-responsive"><table className="table align-middle mb-0">
        <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Payment</th><th>Shipping</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{orders.map((order) => <tr key={order.id}>
          <td><strong>{order.order_number}</strong><small className="d-block text-muted">{new Date(order.created_at).toLocaleDateString("en-LK")}</small></td>
          <td><strong>{order.user?.full_name}</strong><small className="d-block text-muted">{order.user?.email}<br />{order.user?.phone}</small></td>
          <td>{order.items?.map((item) => <small className="d-block" key={item.id}>{item.product_name} × {item.quantity}</small>)}</td>
          <td>{order.payment_method === "CARD" ? "Card (Demo)" : "COD"}<small className={`d-block ${order.payment_status === "PAID" ? "text-success" : "text-warning"}`}>{order.payment_status}</small></td>
          <td>{order.courier_name ? <><strong className="d-block">{order.courier_name}</strong><small className="d-block text-muted">{order.tracking_number}</small></> : <span className="text-muted small">Not dispatched</span>}<button className="btn btn-sm btn-outline-primary mt-2" disabled={!canDispatch(order)} onClick={() => openShipping(order)}>{order.tracking_number ? "Edit shipment" : order.payment_method === "CARD" && order.payment_status !== "PAID" ? "Awaiting payment" : "Dispatch"}</button></td>
          <td><strong>{formatPrice(order.total_amount)}</strong></td>
          <td><select className="form-select form-select-sm" disabled={updatingId === order.id || statusOptionsFor(order).length === 1} value={order.order_status} onChange={(event) => changeStatus(order, event.target.value)}>{statusOptionsFor(order).map((status) => <option value={status} key={status}>{status}</option>)}</select></td>
        </tr>)}</tbody>
      </table></div></div>{meta.last_page > 1 && <nav className="d-flex justify-content-center align-items-center gap-3 mt-4" aria-label="Order pages"><button className="btn btn-outline-primary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button><span className="text-muted small">Page {meta.current_page} of {meta.last_page}</span><button className="btn btn-outline-primary" disabled={page >= meta.last_page} onClick={() => setPage((current) => current + 1)}>Next</button></nav>}</>}
    </main>

    {shippingOrder && <div className="modal d-block" role="dialog" aria-modal="true"><div className="modal-dialog modal-dialog-centered"><form className="modal-content shadow" onSubmit={submitShipping}>
      <div className="modal-header"><div><h2 className="h5 modal-title">Dispatch order</h2><small className="text-muted">{shippingOrder.order_number}</small></div><button type="button" className="btn-close" onClick={() => setShippingOrder(null)} aria-label="Close" /></div>
      <div className="modal-body"><div className="mb-3"><label className="form-label" htmlFor="courier_name">Courier name</label><input className="form-control" id="courier_name" required value={shippingForm.courier_name} onChange={(event) => setShippingForm({ ...shippingForm, courier_name: event.target.value })} placeholder="e.g. Domex" /></div><div className="mb-3"><label className="form-label" htmlFor="tracking_number">Tracking number</label><input className="form-control" id="tracking_number" required value={shippingForm.tracking_number} onChange={(event) => setShippingForm({ ...shippingForm, tracking_number: event.target.value })} placeholder="e.g. DOM123456" /></div><div><label className="form-label" htmlFor="shipping_fee">Delivery fee (Rs.)</label><input className="form-control" id="shipping_fee" type="number" min="0" step="0.01" value={shippingForm.shipping_fee} onChange={(event) => setShippingForm({ ...shippingForm, shipping_fee: event.target.value })} /></div></div>
      <div className="modal-footer"><button type="button" className="btn btn-outline-secondary" onClick={() => setShippingOrder(null)}>Cancel</button><button className="btn btn-primary" disabled={updatingId === shippingOrder.id}>{updatingId === shippingOrder.id ? "Saving..." : "Save & mark shipped"}</button></div>
    </form></div></div>}
    {shippingOrder && <div className="modal-backdrop show" onClick={() => setShippingOrder(null)} />}
    <Footer />
  </div>;
}

export default AdminOrders;
