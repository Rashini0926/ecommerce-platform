import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";

function WishlistCard({ product }) {
  return (
    <div className="card wishlist-card hover-lift card-hover-shadow h-100">
      <div className="product-image-wrap position-relative">
        <img
          src={product.image}
          alt={product.name}
          className="wishlist-image"
          style={{ height: "220px", objectFit: "cover" }}
        />

        <span className="badge bg-danger position-absolute top-0 start-0 m-3">
          <FaHeart className="me-2" />
          Saved
        </span>
      </div>

      <div className="card-body p-4">
        <h5>{product.name}</h5>

        <h4 className="text-primary">
          Rs. {product.price.toLocaleString()}
        </h4>

        <div className="d-grid gap-2 mt-3">
          <button className="btn btn-success ripple">
            <FaShoppingCart className="me-2" />
            Add to Cart
          </button>

          <button className="btn btn-outline-danger">
            <FaTrash className="me-2" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
