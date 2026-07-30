import { useMemo, useState } from "react";
import {
  FaBell,
  FaBoxes,
  FaCheckCircle,
  FaClock,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaGift,
  FaMoneyBillWave,
  FaRegBell,
  FaShieldAlt,
  FaShippingFast,
  FaStar,
  FaStore,
  FaTruck,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { useAuth } from "../context/AuthContext";

const customerNotifications = [
  {
    id: 101,
    title: "Your order is being prepared",
    message: "Order #SO-2091 is now being packed by the seller.",
    category: "Order",
    time: "10 minutes ago",
    unread: true,
    icon: <FaClock />,
    color: "primary",
  },
  {
    id: 102,
    title: "Delivery update available",
    message: "Your Smart Fitness Watch package has been handed to courier.",
    category: "Delivery",
    time: "1 hour ago",
    unread: true,
    icon: <FaTruck />,
    color: "success",
  },
  {
    id: 103,
    title: "Weekend flash offer unlocked",
    message: "You have 2 discount coupons available for your next purchase.",
    category: "Offer",
    time: "Today",
    unread: true,
    icon: <FaGift />,
    color: "danger",
  },
  {
    id: 104,
    title: "Account profile verified",
    message: "Your customer shipping address & profile info are ready.",
    category: "Account",
    time: "Yesterday",
    unread: true,
    icon: <FaShieldAlt />,
    color: "success",
  },
  {
    id: 105,
    title: "Wishlist price drop alert",
    message: "Wireless Headphones from your wishlist are now 15% off!",
    category: "Offer",
    time: "2 days ago",
    unread: false,
    icon: <FaRegBell />,
    color: "primary",
  },
];

const sellerNotifications = [
  {
    id: 201,
    title: "New order #SO-2091 received",
    message: "Customer Nimal Perera placed an order for Wireless Headphones (Rs. 8,500).",
    category: "Orders",
    time: "15 minutes ago",
    unread: true,
    icon: <FaShippingFast />,
    color: "danger",
  },
  {
    id: 202,
    title: "Inventory alert: Low stock",
    message: "Bluetooth Speaker listing has only 4 units remaining in stock.",
    category: "Stock",
    time: "2 hours ago",
    unread: true,
    icon: <FaExclamationTriangle />,
    color: "danger",
  },
  {
    id: 203,
    title: "New 5-star customer review",
    message: "Kasun P. left a 5-star review on your Wireless Headphones.",
    category: "Reviews",
    time: "4 hours ago",
    unread: true,
    icon: <FaStar />,
    color: "warning",
  },
  {
    id: 204,
    title: "Weekly store payout completed",
    message: "Rs. 82,450 has been transferred to your registered seller account.",
    category: "Payouts",
    time: "Yesterday",
    unread: true,
    icon: <FaMoneyBillWave />,
    color: "success",
  },
  {
    id: 205,
    title: "Store performance tier upgraded",
    message: "Your store achieved a 96% order fulfillment rate this month!",
    category: "Store",
    time: "3 days ago",
    unread: false,
    icon: <FaStore />,
    color: "primary",
  },
];

const adminNotifications = [
  {
    id: 301,
    title: "New seller application pending",
    message: "Glamour Fashion House submitted store verification documents.",
    category: "Sellers",
    time: "30 minutes ago",
    unread: true,
    icon: <FaUserCheck />,
    color: "primary",
  },
  {
    id: 302,
    title: "System security scan completed",
    message: "Automated vulnerability scan finished with 0 critical security threats.",
    category: "Security",
    time: "1 hour ago",
    unread: true,
    icon: <FaShieldAlt />,
    color: "success",
  },
  {
    id: 303,
    title: "Monthly platform revenue milestone",
    message: "Platform surpassed Rs. 4.8M in monthly total GMV (+22.4% YoY).",
    category: "Revenue",
    time: "Yesterday",
    unread: true,
    icon: <FaMoneyBillWave />,
    color: "success",
  },
  {
    id: 304,
    title: "User registration spike",
    message: "48 new user accounts registered in the last 24 hours.",
    category: "Users",
    time: "2 days ago",
    unread: true,
    icon: <FaUsers />,
    color: "primary",
  },
  {
    id: 305,
    title: "Database backup completed",
    message: "Daily snapshot snapshot-2026-07-30 saved to cloud storage.",
    category: "System",
    time: "3 days ago",
    unread: false,
    icon: <FaBoxes />,
    color: "secondary",
  },
];

function Notifications() {
  const { user } = useAuth();
  const role = user?.role || "customer";

  const initialData = useMemo(() => {
    if (role === "admin") return adminNotifications;
    if (role === "seller") return sellerNotifications;
    return customerNotifications;
  }, [role]);

  const filterOptions = useMemo(() => {
    if (role === "admin") return ["All", "Unread", "Sellers", "Security", "Revenue", "System"];
    if (role === "seller") return ["All", "Unread", "Orders", "Stock", "Reviews", "Payouts"];
    return ["All", "Unread", "Order", "Delivery", "Offer", "Account"];
  }, [role]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState(initialData);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.category === activeFilter);
  }, [activeFilter, notifications]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        unread: false,
      }))
    );
  };

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              unread: !n.unread,
            }
          : n
      )
    );
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <section className="notifications-header mb-4">
          <div>
            <span className="section-kicker">
              {role === "admin"
                ? "System Administrative Alerts"
                : role === "seller"
                ? "Seller Operations Alerts"
                : "Customer Updates"}
            </span>

            <h1 className="mt-2 mb-2">
              <FaBell
                className={`me-2 ${
                  role === "admin"
                    ? "text-danger"
                    : role === "seller"
                    ? "text-success"
                    : "text-primary"
                }`}
              />
              {role === "admin"
                ? "Admin Console Notifications"
                : role === "seller"
                ? "Seller Hub Notifications"
                : "Notifications"}
            </h1>

            <p className="text-muted mb-0">
              {role === "admin"
                ? "Monitor seller applications, platform security scans, and system metrics."
                : role === "seller"
                ? "Track incoming order queues, low stock alerts, payouts, and customer reviews."
                : "Track order status, delivery updates, exclusive offers, and account alerts."}
            </p>
          </div>

          <div className="notifications-header-actions">
            <span
              className={`badge badge-soft-${
                role === "admin" ? "danger" : role === "seller" ? "warning" : "primary"
              }`}
            >
              {unreadCount} unread
            </span>

            <button
              type="button"
              className={`btn ${
                role === "admin"
                  ? "btn-danger"
                  : role === "seller"
                  ? "btn-success"
                  : "btn-primary"
              }`}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <FaCheckCircle className="me-2" />
              Mark All Read
            </button>
          </div>
        </section>

        {/* Dynamic Category Filter Bar */}
        <div className="notification-filter-bar mb-4">
          {filterOptions.map((filter) => (
            <button
              type="button"
              className={`btn ${
                activeFilter === filter
                  ? role === "admin"
                    ? "btn-danger"
                    : role === "seller"
                    ? "btn-success"
                    : "btn-primary"
                  : "btn-outline-secondary"
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        {filteredNotifications.length === 0 ? (
          <div className="card glass-card empty-state">
            <div className="empty-illustration mb-4">
              <FaEnvelopeOpenText size={42} />
            </div>

            <h4>No notifications found</h4>
            <p className="text-muted">
              {role === "admin"
                ? "All system security logs and seller applications are up to date."
                : role === "seller"
                ? "No pending store alerts or order notifications right now."
                : "New shopping updates will appear here when available."}
            </p>
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((notification) => (
              <article
                className={`card notification-card ${
                  notification.unread ? "notification-unread" : ""
                }`}
                key={notification.id}
              >
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                    <span
                      className={`notification-icon notification-icon-${notification.color}`}
                    >
                      {notification.icon}
                    </span>

                    <div className="flex-grow-1">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <span className={`badge badge-soft-${notification.color}`}>
                          {notification.category}
                        </span>

                        {notification.unread && (
                          <span className="badge badge-soft-danger">New</span>
                        )}
                      </div>

                      <h5 className="mb-1">{notification.title}</h5>
                      <p className="text-muted mb-0">{notification.message}</p>
                    </div>

                    <div className="notification-meta">
                      <span>{notification.time}</span>

                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                        onClick={() => toggleReadStatus(notification.id)}
                      >
                        {notification.unread ? "Mark Read" : "Mark Unread"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Notifications;
