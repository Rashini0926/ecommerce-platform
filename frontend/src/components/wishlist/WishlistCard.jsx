import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";

function WishlistCard({ product }) {
  return (
    <div className="card shadow-sm h-100">
      <img
        src={product.image}
        alt={product.name}
        className="card-img-top"
        style={{ height: "220px", objectFit: "cover" }}
      />

      <div className="card-body">
        <h5>{product.name}</h5>

        <h4 className="text-primary">
          Rs. {product.price.toLocaleString()}
        </h4>

        <div className="d-grid gap-2 mt-3">
          <button className="btn btn-success">
            <FaShoppingCart className="me-2" />
            Add to Cart
          </button>

          <button className="btn btn-outline-danger">
            <FaTrash className="me-2" />
            Remove
          </button>
        </div>
      </div>

      <div className="card-footer text-center">
        <FaHeart className="text-danger me-2" />
        Saved for Later
      </div>
    </div>
  );
}

export default WishlistCard;