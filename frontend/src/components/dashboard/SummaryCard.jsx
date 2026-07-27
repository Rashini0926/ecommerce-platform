import { Link } from "react-router-dom";
import {
  FaHeart,
  FaShoppingBag,
  FaShoppingCart,
} from "react-icons/fa";

function SummaryCard({
  title,
  value,
  color,
}) {
  const icons = {
    Orders: <FaShoppingBag />,
    Wishlist: <FaHeart />,
    Cart: <FaShoppingCart />,
  };

  const links = {
    Orders: "/dashboard",
    Wishlist: "/wishlist",
    Cart: "/cart",
  };

  return (
    <div className="col-md-4">
      <div className="card stat-card hover-lift card-hover-shadow h-100">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className={`icon-circle fs-3 text-${color}`}>
              {icons[title]}
            </div>

            <span className={`badge badge-soft-${color}`}>
              Live
            </span>
          </div>

          <p className="text-muted mb-1">{title}</p>
          <h2 className={`text-${color} mb-3`}>{value}</h2>

          <Link
            to={links[title]}
            className={`btn btn-outline-${color} w-100`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
