import { Link } from "react-router-dom";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import SummaryCard from "../components/dashboard/SummaryCard";

function Dashboard() {
  return (
    <div className="container py-4">

      <WelcomeCard />

      <div className="row">

        <SummaryCard
          title="Orders"
          value="0"
          color="primary"
        />

        <SummaryCard
          title="Wishlist"
          value="0"
          color="danger"
        />

        <SummaryCard
          title="Cart"
          value="0"
          color="success"
        />

      </div>

      <div className="card shadow-sm border-0 mt-4">

        <div className="card-body">

          <h4 className="mb-3">
            Quick Actions
          </h4>

          <div className="d-flex flex-wrap gap-3">

            <Link
              to="/"
              className="btn btn-primary"
            >
              Continue Shopping
            </Link>

            <Link
              to="/profile"
              className="btn btn-outline-primary"
            >
              My Profile
            </Link>

            <button className="btn btn-outline-danger">
              Wishlist
            </button>

            <button className="btn btn-outline-success">
              Cart
            </button>

            <button className="btn btn-outline-secondary">
              Settings
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;