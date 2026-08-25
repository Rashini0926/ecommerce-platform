import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaClipboardList, FaExclamationTriangle, FaPlus, FaShippingFast, FaStore, FaWallet } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { getMyProducts } from "../services/productService";
import api from "../utils/api";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function SellerDashboard() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [productData, orderData] = await Promise.all([getMyProducts(token), api.get("/seller/order-items", { headers })]);
        setProducts(productData || []);
        setItems(orderData.data.order_items || []);
      } catch (err) { setError(err.response?.data?.message || "Unable to load seller workspace."); }
      finally { setLoading(false); }
    };
    if (token) load();
  }, [token]);

  const metrics = useMemo(() => ({
    lowStock: products.filter((product) => Number(product.stock) <= 5).length,
    pending: items.filter((item) => item.fulfillment_status !== "SHIPPED").length,
    shipped: items.filter((item) => item.fulfillment_status === "SHIPPED").length,
    revenue: items.reduce((total, item) => total + Number(item.subtotal || 0), 0),
  }), [products, items]);

  const cards = [
    ["Active products", products.length, `${metrics.lowStock} low-stock alerts`, <FaBoxOpen />, "primary"],
    ["Fulfillment queue", metrics.pending, "Items awaiting action", <FaClipboardList />, "warning"],
    ["Items shipped", metrics.shipped, "Completed fulfillment items", <FaShippingFast />, "success"],
    ["Order value", money(metrics.revenue), "Seller order items", <FaWallet />, "dark"],
  ];

  return <div className="app-page bg-light-subtle min-vh-100"><Navbar /><main className="container py-4 py-lg-5">
    <section className="rounded-4 p-4 p-lg-5 mb-4 text-white shadow-sm" style={{ background: "linear-gradient(135deg,#0f766e,#115e59 55%,#0f172a)" }}>
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-lg-center"><div><span className="badge text-bg-light text-success mb-3"><FaStore className="me-2" />Seller workspace</span><h1 className="h2 mb-2">Good to see you, {user?.full_name || "Seller"}</h1><p className="mb-0 text-white-50">Manage your catalog, fulfillment queue, and stock from one place.</p></div><Link to="/seller/products" className="btn btn-light fw-semibold px-4"><FaPlus className="me-2" />Manage products</Link></div>
    </section>
    {error && <div className="alert alert-danger">{error}</div>}
    {loading ? <div className="text-center py-5"><LoadingSpinner size="lg" text="Loading seller workspace..." /></div> : <>
      <section className="row g-3 mb-4">{cards.map(([label, value, note, icon, tone]) => <div className="col-sm-6 col-xl-3" key={label}><article className="card h-100 border-0 shadow-sm"><div className="card-body p-4"><div className={`text-${tone} fs-4 mb-3`}>{icon}</div><div className="text-muted small mb-1">{label}</div><div className="h3 mb-1">{value}</div><small className="text-muted">{note}</small></div></article></div>)}</section>
      <section className="row g-4"><div className="col-lg-8"><article className="card border-0 shadow-sm h-100"><div className="card-body p-4"><h2 className="h5 mb-1">Fulfillment queue</h2><p className="text-muted small mb-4">Latest customer orders containing your products.</p>{items.length === 0 ? <div className="text-center py-5 text-muted"><FaClipboardList className="fs-2 mb-3" /><p className="mb-0">No seller orders yet.</p></div> : <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Order</th><th>Product</th><th>Customer</th><th>Status</th><th className="text-end">Amount</th></tr></thead><tbody>{items.slice(0, 6).map((item) => <tr key={item.id}><td><strong>{item.order?.order_number}</strong><br /><small className="text-muted">Qty: {item.quantity}</small></td><td>{item.product_name}</td><td>{item.order?.user?.full_name || "Customer"}</td><td><span className={`badge ${item.fulfillment_status === "SHIPPED" ? "text-bg-success" : item.fulfillment_status === "READY_TO_SHIP" ? "text-bg-warning" : "text-bg-secondary"}`}>{item.fulfillment_status?.replaceAll("_", " ")}</span></td><td className="text-end fw-semibold">{money(item.subtotal)}</td></tr>)}</tbody></table></div>}</div></article></div>
      <div className="col-lg-4"><article className="card border-0 shadow-sm mb-4"><div className="card-body p-4"><h2 className="h5 mb-3">Inventory attention</h2>{metrics.lowStock === 0 ? <p className="text-success mb-0">All products have healthy stock levels.</p> : products.filter((product) => Number(product.stock) <= 5).slice(0, 5).map((product) => <div className="d-flex gap-3 py-3 border-top" key={product.id}><FaExclamationTriangle className="text-warning mt-1" /><div><div className="fw-semibold">{product.name}</div><small className="text-muted">Only {product.stock} units remaining</small></div></div>)}</div></article><article className="card border-0 shadow-sm"><div className="card-body p-4"><h2 className="h5 mb-3">Quick actions</h2><div className="d-grid gap-2"><Link to="/seller/products" className="btn btn-success">Add or edit product</Link><Link to="/notifications" className="btn btn-outline-secondary">View notifications</Link></div></div></article></div></section>
    </>}
  </main><Footer /></div>;
}
