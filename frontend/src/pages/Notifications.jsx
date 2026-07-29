import { useMemo, useState } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaClock,
  FaEnvelopeOpenText,
  FaGift,
  FaRegBell,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const notificationData = [
  {
    id: 1,
    title: "Your order is being prepared",
    message: "Order SE-10021 is now being packed by the seller.",
    category: "Order",
    time: "10 minutes ago",
    unread: true,
    icon: <FaClock />,
    color: "primary",
  },
  {
    id: 2,
    title: "Delivery update available",
    message: "Your smart watch package has been handed over to delivery.",
    category: "Delivery",
    time: "1 hour ago",
    unread: true,
    icon: <FaTruck />,
    color: "success",
  },
  {
    id: 3,
    title: "Weekend offer unlocked",
    message: "You have 2 coupons available for your next purchase.",
    category: "Offer",
    time: "Today",
    unread: true,
    icon: <FaGift />,
    color: "danger",
  },
  {
    id: 4,
    title: "Account profile verified",
    message: "Your customer profile information is ready for checkout.",
    category: "Account",
    time: "Yesterday",
    unread: true,
    icon: <FaShieldAlt />,
    color: "success",
  },
  {
    id: 5,
    title: "Wishlist reminder",
    message: "Wireless Headphones from your wishlist are still available.",
    category: "Offer",
    time: "2 days ago",
    unread: false,
    icon: <FaRegBell />,
    color: "primary",
  },
];

const filters = ["All", "Unread", "Order", "Delivery", "Offer", "Account"];

function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState(notificationData);

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "All") {
      return notifications;
    }

    if (activeFilter === "Unread") {
      return notifications.filter((notification) => notification.unread);
    }

    return notifications.filter(
      (notification) => notification.category === activeFilter
    );
  }, [activeFilter, notifications]);

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const toggleReadStatus = (id) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: !notification.unread,
            }
          : notification
      )
    );
  };

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <section className="notifications-header mb-4">
          <div>
            <span className="section-kicker">Customer updates</span>
            <h1 className="mt-2 mb-2">
              <FaBell className="me-2 text-primary" />
              Notifications
            </h1>
            <p className="text-muted mb-0">
              Track order alerts, delivery updates, offers, and account messages.
            </p>
          </div>

          <div className="notifications-header-actions">
            <span className="badge badge-soft-danger">
              {unreadCount} unread
            </span>

            <button
              type="button"
              className="btn btn-primary"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <FaCheckCircle className="me-2" />
              Mark All Read
            </button>
          </div>
        </section>

        <div className="notification-filter-bar mb-4">
          {filters.map((filter) => (
            <button
              type="button"
              className={`btn ${activeFilter === filter ? "btn-primary" : "btn-outline-primary"}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="card glass-card empty-state">
            <div className="empty-illustration mb-4">
              <FaEnvelopeOpenText size={42} />
            </div>

            <h4>No notifications found.</h4>
            <p className="text-muted">
              New shopping updates will appear here when available.
            </p>
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((notification) => (
              <article
                className={`card notification-card ${notification.unread ? "notification-unread" : ""}`}
                key={notification.id}
              >
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                    <span className={`notification-icon notification-icon-${notification.color}`}>
                      {notification.icon}
                    </span>

                    <div className="flex-grow-1">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                        <span className={`badge badge-soft-${notification.color}`}>
                          {notification.category}
                        </span>

                        {notification.unread && (
                          <span className="badge badge-soft-danger">
                            New
                          </span>
                        )}
                      </div>

                      <h5 className="mb-1">{notification.title}</h5>
                      <p className="text-muted mb-0">{notification.message}</p>
                    </div>

                    <div className="notification-meta">
                      <span>{notification.time}</span>

                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
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
