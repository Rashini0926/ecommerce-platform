import { Link } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaRegSmile,
  FaShoppingBag,
  FaUserCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function WelcomeCard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <section className="dashboard-hero mb-4 slide-up">
      <div className="dashboard-hero-content">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
            <div className="dashboard-avatar">
              <FaUserCircle />
            </div>

            <div>
              <span className="badge bg-light text-primary mb-2">
                <FaRegSmile className="me-2" />
                Customer dashboard
              </span>

              <h1 className="h2 mb-2">
                {getGreeting()}, {user?.full_name || "Customer"}
              </h1>

              <p className="mb-0 text-white-50">
                Manage your orders, saved items, account details, and shopping activity in one place.
              </p>
            </div>
          </div>

          <div className="dashboard-hero-actions">
            <Link to="/products" className="btn btn-light text-primary">
              <FaShoppingBag className="me-2" />
              Shop Now
            </Link>

            <Link to="/profile" className="btn btn-outline-light">
              View Profile
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-strip mt-4">
          <div>
            <FaCheckCircle />
            <span>Account verified</span>
          </div>

          <div>
            <FaMapMarkerAlt />
            <span>Delivery details ready</span>
          </div>

          <div>
            <FaBell />
            <span>3 shopping updates</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WelcomeCard;
