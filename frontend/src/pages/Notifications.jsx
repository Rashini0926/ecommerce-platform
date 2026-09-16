import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaCreditCard,
  FaEnvelope,
  FaEnvelopeOpenText,
  FaShippingFast,
  FaSms,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { refreshAccountCounts } from "../utils/accountEvents";

const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const iconFor = (type) => {
  if (type === "SHIPPING") return <FaShippingFast />;
  if (type === "PAYMENT") return <FaCreditCard />;
  return <FaBell />;
};

const deliveryBadge = (status) => {
  if (["SENT", "QUEUED"].includes(status)) return "text-bg-success";
  if (status === "FAILED") return "text-bg-danger";
  return "text-bg-secondary";
};

export default function Notifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/notifications?page=${page}`, authConfig(token));

        if (!cancelled) {
          const result = response.data.notifications;
          setNotifications(result.data || []);
          setUnreadCount(response.data.unread_count || 0);
          setLastPage(result.last_page || 1);
          setTotal(result.total || 0);
          setError("");
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.message || "Unable to load notifications.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (token) load();

    return () => {
      cancelled = true;
    };
  }, [page, token]);

  const visible = useMemo(
    () => filter === "unread"
      ? notifications.filter((item) => !item.read_at)
      : notifications,
    [filter, notifications]
  );

  const markRead = async (notification) => {
    if (notification.read_at) return;

    try {
      const response = await api.patch(
        `/notifications/${notification.id}/read`,
        {},
        authConfig(token)
      );
      setNotifications((items) => items.map((item) =>
        item.id === notification.id ? response.data.notification : item
      ));
      setUnreadCount((count) => Math.max(0, count - 1));
      refreshAccountCounts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update notification.");
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all", {}, authConfig(token));
      setNotifications((items) => items.map((item) => ({
        ...item,
        read_at: item.read_at || new Date().toISOString(),
      })));
      setUnreadCount(0);
      refreshAccountCounts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update notifications.");
    }
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <section className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="section-kicker">Account updates</span>
            <h1 className="mt-2 mb-1"><FaBell className="me-2 text-primary" />Notifications</h1>
            <p className="text-muted mb-0">Order, payment, email, SMS, and shipping updates in one place.</p>
          </div>
          <button className="btn btn-primary" disabled={!unreadCount} onClick={markAllRead}>
            <FaCheckCircle className="me-2" />Mark all read
          </button>
        </section>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="d-flex gap-2">
            <button className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setFilter("all")}>
              All ({total})
            </button>
            <button className={`btn btn-sm ${filter === "unread" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </button>
          </div>
          <small className="text-muted">Page {page} of {lastPage}</small>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5"><LoadingSpinner size="lg" text="Loading notifications..." /></div>
        ) : visible.length === 0 ? (
          <div className="card glass-card empty-state">
            <FaEnvelopeOpenText size={42} className="mb-3 text-muted" />
            <h4>No notifications</h4>
            <p className="text-muted mb-0">New order and shipping updates will appear here.</p>
          </div>
        ) : (
          <div className="notification-list">
            {visible.map((notification) => (
              <article className={`card notification-card ${!notification.read_at ? "notification-unread" : ""}`} key={notification.id}>
                <div className="card-body p-4 d-flex gap-3 align-items-start">
                  <span className="notification-icon notification-icon-primary">{iconFor(notification.type)}</span>
                  <div className="flex-grow-1">
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                      <div>
                        <span className="badge badge-soft-primary mb-2">{notification.type.replaceAll("_", " ")}</span>
                        <h5 className="mb-1">{notification.title}</h5>
                      </div>
                      <small className="text-muted text-md-nowrap">{new Date(notification.created_at).toLocaleString("en-LK")}</small>
                    </div>
                    <p className="text-muted mb-3">{notification.message}</p>

                    {!!notification.deliveries?.length && (
                      <div className="d-flex flex-wrap gap-2 mb-3" aria-label="Notification delivery status">
                        {notification.deliveries.map((delivery) => (
                          <span className={`badge ${deliveryBadge(delivery.status)}`} key={delivery.id}>
                            {delivery.channel === "EMAIL" ? <FaEnvelope className="me-1" /> : <FaSms className="me-1" />}
                            {delivery.channel}: {delivery.status}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="d-flex flex-wrap gap-2">
                      {!notification.read_at && (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => markRead(notification)}>
                          Mark as read
                        </button>
                      )}
                      {notification.data?.order_id && (
                        <Link className="btn btn-sm btn-outline-primary" to={`/orders/${notification.data.order_id}`}>
                          View order
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && lastPage > 1 && (
          <nav className="d-flex align-items-center justify-content-center gap-3 mt-4" aria-label="Notification pages">
            <button className="btn btn-outline-primary" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
            <span className="text-muted small">Page {page} of {lastPage}</span>
            <button className="btn btn-outline-primary" disabled={page === lastPage} onClick={() => setPage((current) => current + 1)}>Next</button>
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
}
