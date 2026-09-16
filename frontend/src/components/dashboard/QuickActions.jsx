import { Link } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkedAlt,
  FaSearch,
  FaShoppingCart,
  FaUserEdit,
  FaWallet,
} from "react-icons/fa";

const actions = [
  {
    title: "Browse Products",
    text: "Search categories and discover new deals.",
    icon: <FaSearch />,
    link: "/products",
    color: "primary",
  },
  {
    title: "My Wishlist",
    text: "Review saved items before buying.",
    icon: <FaHeart />,
    link: "/wishlist",
    color: "danger",
  },
  {
    title: "Shopping Cart",
    text: "Continue checkout from your cart.",
    icon: <FaShoppingCart />,
    link: "/cart",
    color: "success",
  },
  {
    title: "Edit Profile",
    text: "Keep account information updated.",
    icon: <FaUserEdit />,
    link: "/profile",
    color: "primary",
  },
  {
    title: "Delivery Address",
    text: "Prepare shipping details for checkout.",
    icon: <FaMapMarkedAlt />,
    link: "/profile",
    color: "accent",
  },
  {
    title: "Payment Options",
    text: "Payment setup will connect during checkout.",
    icon: <FaWallet />,
    link: "/cart",
    color: "success",
  },
];

function QuickActions() {
  return (
    <div className="card glass-card h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <span className="section-kicker">Shortcuts</span>
            <h4 className="mb-0 mt-2">Quick Actions</h4>
          </div>
        </div>

        <div className="row g-3">
          {actions.map((action) => (
            <div className="col-sm-6" key={action.title}>
              <Link
                to={action.link}
                className={`dashboard-action dashboard-action-${action.color}`}
              >
                <span className="dashboard-action-icon">
                  {action.icon}
                </span>

                <span>
                  <strong>{action.title}</strong>
                  <small>{action.text}</small>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickActions;
