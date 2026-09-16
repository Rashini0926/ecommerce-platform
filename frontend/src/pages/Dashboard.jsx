import { useEffect, useState } from "react";
import { FaBell, FaBoxOpen, FaCheckCircle, FaCreditCard, FaHeart, FaMapMarkerAlt, FaShoppingBag, FaShoppingCart, FaTruck } from "react-icons/fa";
import LoadingSpinner from "../components/common/LoadingSpinner";
import QuickActions from "../components/dashboard/QuickActions";
import RecentOrders from "../components/dashboard/RecentOrders";
import SummaryCard from "../components/dashboard/SummaryCard";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.get("/customer/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => { if (!cancelled) setData(response.data); })
      .catch((requestError) => { if (!cancelled) setError(requestError.response?.data?.message || "Unable to load your dashboard."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const summary = data?.summary || {};
  const latestOrder = data?.latest_order;
  const cards = [
    { title: "Total orders", value: summary.total_orders || 0, description: "Orders placed from this account", icon: <FaShoppingBag />, color: "primary", link: "/orders" },
    { title: "Wishlist items", value: summary.wishlist_items || 0, description: "Products saved for later", icon: <FaHeart />, color: "danger", link: "/wishlist" },
    { title: "Cart quantity", value: summary.cart_items || 0, description: "Units waiting for checkout", icon: <FaShoppingCart />, color: "success", link: "/cart" },
    { title: "Unread updates", value: summary.unread_notifications || 0, description: "Order and delivery notifications", icon: <FaBell />, color: "primary", link: "/notifications" },
  ];

  return (
    <div className="app-page">
      <Navbar />
      <main className="container py-5">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {loading ? (
          <div className="text-center py-5"><LoadingSpinner size="lg" text="Loading your dashboard..." /></div>
        ) : (
          <>
            <WelcomeCard unreadCount={summary.unread_notifications} addressCount={summary.saved_addresses} />
            <section className="row g-4 mb-4" aria-label="Account summary">
              {cards.map((card) => <SummaryCard key={card.title} {...card} />)}
            </section>

            <section className="row g-4 mb-4">
              <div className="col-xl-8"><RecentOrders orders={data?.recent_orders} /></div>
              <div className="col-xl-4">
                <article className="card glass-card h-100">
                  <div className="card-body p-4">
                    <span className="section-kicker">Delivery tracking</span>
                    <h2 className="h4 mb-4 mt-2">Latest order</h2>
                    {!latestOrder ? <p className="text-muted">Place your first order to see delivery progress.</p> : latestOrder.order_status === "CANCELLED" ? <div className="alert alert-danger mb-0">Order {latestOrder.order_number} was cancelled.</div> : <DeliveryTimeline order={latestOrder} />}
                  </div>
                </article>
              </div>
            </section>

            <section className="row g-4">
              <div className="col-xl-8"><QuickActions /></div>
              <div className="col-xl-4">
                <article className="card glass-card h-100">
                  <div className="card-body p-4">
                    <span className="section-kicker">Account readiness</span>
                    <h2 className="h4 mb-4 mt-2">Customer setup</h2>
                    <AccountTask icon={<FaCheckCircle />} title="Profile information" value={user?.full_name && user?.phone ? "Complete" : "Needs attention"} tone="success" />
                    <AccountTask icon={<FaMapMarkerAlt />} title="Delivery addresses" value={`${summary.saved_addresses || 0} saved`} tone="primary" />
                    <AccountTask icon={<FaCreditCard />} title="Payment options" value="Card or cash at checkout" tone="accent" />
                  </div>
                </article>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function DeliveryTimeline({ order }) {
  const rank = { PENDING: 0, PROCESSING: 1, SHIPPED: 2, DELIVERED: 3 }[order.order_status] ?? 0;
  const steps = [
    { title: "Order placed", text: order.order_number, icon: <FaShoppingBag /> },
    { title: "Processing", text: "Items are being prepared", icon: <FaBoxOpen /> },
    { title: "On delivery", text: order.courier_name || "Courier pickup pending", icon: <FaTruck /> },
    { title: "Delivered", text: order.delivered_at ? new Date(order.delivered_at).toLocaleDateString("en-LK") : "Awaiting delivery", icon: <FaCheckCircle /> },
  ];

  return <div className="dashboard-timeline">{steps.map((step, index) => <div className={`dashboard-timeline-item ${rank >= index ? "active" : ""}`} key={step.title}><span className="dashboard-timeline-icon">{step.icon}</span><span><strong>{step.title}</strong><small>{step.text}</small></span></div>)}</div>;
}

function AccountTask({ icon, title, value, tone }) {
  return <div className="dashboard-task mb-3"><span className={`dashboard-task-icon dashboard-task-${tone}`}>{icon}</span><span><strong>{title}</strong><small>{value}</small></span></div>;
}
