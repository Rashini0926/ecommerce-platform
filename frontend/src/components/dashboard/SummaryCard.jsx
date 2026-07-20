import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";

function SummaryCard({
  title,
  value,
  color,
}) {

  const icons = {
    Orders: <FaShoppingBag size={35} />,
    Wishlist: <FaHeart size={35} />,
    Cart: <FaShoppingCart size={35} />,
  };

  return (
    <div className="col-md-4 mb-4">

      <div
        className={`card border-${color} shadow-sm h-100`}
      >

        <div className="card-body text-center">

          <div
            className={`text-${color} mb-3`}
          >
            {icons[title]}
          </div>

          <h5>{title}</h5>

          <h2 className={`text-${color}`}>
            {value}
          </h2>

          <Link
            to="/"
            className={`btn btn-outline-${color} mt-3`}
          >
            View
          </Link>

        </div>

      </div>

    </div>
  );
}

export default SummaryCard;