import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";

function WishlistCard({
  item,
  onMoveToCart,
  onRemove,
  isProcessing,
}) {
  const product = item.product;

  return (
    <div className="card wishlist-card hover-lift card-hover-shadow h-100">
      <div className="product-image-wrap position-relative">
        <img
          src={product?.image || "https://via.placeholder.com/400x300?text=Product"}
          alt={product?.name || "Product"}
          className="wishlist-image"
        />

        <span className="badge bg-danger position-absolute top-0 start-0 m-3">
          <FaHeart className="me-2" />
          Saved
        </span>
      </div>

      <div className="card-body p-4 d-flex flex-column">
        <p className="text-muted small fw-bold mb-1">
          {product?.category?.name || "Product"}
        </p>

        <h5>{product?.name}</h5>

        <h4 className="text-primary">
          Rs. {Number(product?.price || 0).toLocaleString()}
        </h4>

        <div className="d-grid gap-2 mt-auto">
          <button
            className="btn btn-success ripple"
            disabled={isProcessing}
            onClick={() => onMoveToCart(item)}
          >
            <FaShoppingCart className="me-2" />
            Add to Cart
          </button>

          <button
            className="btn btn-outline-danger"
            disabled={isProcessing}
            onClick={() => onRemove(item.id)}
          >
            <FaTrash className="me-2" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
