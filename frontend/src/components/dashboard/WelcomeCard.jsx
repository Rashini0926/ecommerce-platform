import { Link } from "react-router-dom";
import { FaBell, FaCheckCircle, FaMapMarkerAlt, FaRegSmile, FaShoppingBag, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function WelcomeCard({ unreadCount = 0, addressCount = 0 }) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <section className="dashboard-hero mb-4 slide-up">
      <div className="dashboard-hero-content">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
            <div className="dashboard-avatar"><FaUserCircle /></div>
            <div>
              <span className="badge bg-light text-primary mb-2"><FaRegSmile className="me-2" />Customer dashboard</span>
              <h1 className="h2 mb-2">{greeting}, {user?.full_name || "Customer"}</h1>
              <p className="mb-0 text-white-50">Manage orders, saved items, delivery addresses, and account updates in one place.</p>
            </div>
          </div>
          <div className="dashboard-hero-actions">
            <Link to="/products" className="btn btn-light text-primary"><FaShoppingBag className="me-2" />Shop now</Link>
            <Link to="/profile" className="btn btn-outline-light">View profile</Link>
          </div>
        </div>

        <div className="dashboard-hero-strip mt-4">
          <div><FaCheckCircle /><span>Active account</span></div>
          <div><FaMapMarkerAlt /><span>{addressCount} saved address{addressCount === 1 ? "" : "es"}</span></div>
          <div><FaBell /><span>{unreadCount} unread update{unreadCount === 1 ? "" : "s"}</span></div>
        </div>
      </div>
    </section>
  );
}
