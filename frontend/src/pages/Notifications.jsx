import { useEffect, useMemo, useState } from "react";
import { FaBell, FaCheckCircle, FaEnvelopeOpenText, FaShippingFast } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const authConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } });
const iconFor = (type) => type === "SHIPPING" ? <FaShippingFast /> : <FaBell />;

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/notifications", authConfig(token));
        setNotifications(response.data.notifications.data || []);
      } catch (err) { setError(err.response?.data?.message || "Unable to load notifications."); }
      finally { setLoading(false); }
    };
    if (token) load();
  }, [token]);

  const unreadCount = notifications.filter((item) => !item.read_at).length;
  const visible = useMemo(() => filter === "unread" ? notifications.filter((item) => !item.read_at) : notifications, [filter, notifications]);

  const markRead = async (notification) => {
    if (notification.read_at) return;
    try {
      const response = await api.patch(`/notifications/${notification.id}/read`, {}, authConfig(token));
      setNotifications((items) => items.map((item) => item.id === notification.id ? response.data.notification : item));
    } catch (err) { setError(err.response?.data?.message || "Unable to update notification."); }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all", {}, authConfig(token));
      setNotifications((items) => items.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    } catch (err) { setError(err.response?.data?.message || "Unable to update notifications."); }
  };

  return <div className="app-page"><Navbar /><main className="container py-5">
    <section className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"><div><span className="section-kicker">Account updates</span><h1 className="mt-2 mb-1"><FaBell className="me-2 text-primary" />Notifications</h1><p className="text-muted mb-0">Orders, shipping, and account updates in one place.</p></div><button className="btn btn-primary" disabled={!unreadCount} onClick={markAllRead}><FaCheckCircle className="me-2" />Mark all read</button></section>
    <div className="d-flex gap-2 mb-4"><button className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setFilter("all")}>All ({notifications.length})</button><button className={`btn btn-sm ${filter === "unread" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setFilter("unread")}>Unread ({unreadCount})</button></div>
    {error && <div className="alert alert-danger">{error}</div>}
    {loading ? <div className="text-center py-5"><LoadingSpinner size="lg" text="Loading notifications..." /></div> : visible.length === 0 ? <div className="card glass-card empty-state"><FaEnvelopeOpenText size={42} className="mb-3 text-muted" /><h4>No notifications</h4><p className="text-muted mb-0">New order and shipping updates will appear here.</p></div> : <div className="notification-list">{visible.map((notification) => <article className={`card notification-card mb-3 ${!notification.read_at ? "notification-unread" : ""}`} key={notification.id}><div className="card-body p-4 d-flex gap-3 align-items-start"><span className="notification-icon notification-icon-primary">{iconFor(notification.type)}</span><div className="flex-grow-1"><div className="d-flex justify-content-between gap-3"><div><span className="badge badge-soft-primary mb-2">{notification.type.replaceAll("_", " ")}</span><h5 className="mb-1">{notification.title}</h5></div><small className="text-muted text-nowrap">{new Date(notification.created_at).toLocaleString()}</small></div><p className="text-muted mb-2">{notification.message}</p>{!notification.read_at && <button className="btn btn-sm btn-outline-secondary" onClick={() => markRead(notification)}>Mark as read</button>}</div></div></article>)}</div>}
  </main><Footer /></div>;
}
