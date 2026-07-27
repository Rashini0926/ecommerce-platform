import { Link } from "react-router-dom";
import {
  FaCog,
  FaHeart,
  FaShoppingBag,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import SummaryCard from "../components/dashboard/SummaryCard";

function Dashboard() {
  const activities = [
    "Wishlist refreshed with 3 saved products",
    "Cart is ready with 2 items",
    "Profile details are available",
  ];

  return (
    <div className="app-page">
      <Navbar />

      <main className="container py-5">
        <WelcomeCard />

        <div className="row g-4 mb-4">
          <SummaryCard
            title="Orders"
            value="0"
            color="primary"
          />

          <SummaryCard
            title="Wishlist"
            value="3"
            color="danger"
          />

          <SummaryCard
            title="Cart"
            value="2"
            color="success"
          />
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <span className="section-kicker">Shortcuts</span>
                    <h4 className="mb-0 mt-2">Quick Actions</h4>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <Link to="/" className="btn btn-primary w-100 ripple">
                      <FaShoppingBag className="me-2" />
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="col-sm-6">
                    <Link to="/profile" className="btn btn-outline-primary w-100">
                      <FaUser className="me-2" />
                      My Profile
                    </Link>
                  </div>

                  <div className="col-sm-6">
                    <Link to="/wishlist" className="btn btn-outline-danger w-100">
                      <FaHeart className="me-2" />
                      Wishlist
                    </Link>
                  </div>

                  <div className="col-sm-6">
                    <Link to="/cart" className="btn btn-outline-success w-100">
                      <FaShoppingCart className="me-2" />
                      Cart
                    </Link>
                  </div>

                  <div className="col-12">
                    <button className="btn btn-outline-secondary w-100">
                      <FaCog className="me-2" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card glass-card h-100">
              <div className="card-body p-4">
                <span className="section-kicker">Recent activity</span>
                <h4 className="mb-4 mt-2">Account Snapshot</h4>

                <div className="d-grid gap-3">
                  {activities.map((activity) => (
                    <div className="d-flex align-items-center gap-3 info-row" key={activity}>
                      <span className="activity-dot"></span>
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
