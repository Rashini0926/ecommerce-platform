import {
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { productImageSource, useProductImageFallback } from "../../utils/productImage";

function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
  isProcessing,
}) {
  const product = item.product;
  const unitPrice = Number(product?.sale_price ?? product?.price ?? 0);
  const itemSubtotal = unitPrice * item.quantity;

  return (
    <tr>
      <td className="ps-4">
        <img
          src={productImageSource(product?.image)}
          alt={product?.name || "Product"}
          onError={useProductImageFallback}
          className="cart-image rounded-4"
          width="72"
          height="72"
        />
      </td>

      <td>
        <div className="fw-bold">{product?.name}</div>
        <small className="text-muted">
          {product?.stock > 0 ? "In stock" : "Stock status unavailable"}
        </small>
      </td>

      <td className="fw-semibold">
        Rs. {unitPrice.toLocaleString()}
      </td>

      <td>
        <div className="quantity-control">
          <button
            className="btn btn-sm btn-outline-secondary"
            aria-label="Decrease quantity"
            disabled={isProcessing || item.quantity <= 1}
            onClick={() => onDecrease(item)}
          >
            <FaMinus />
          </button>

          <span className="fw-bold px-1">{item.quantity}</span>

          <button
            className="btn btn-sm btn-outline-secondary"
            aria-label="Increase quantity"
            disabled={isProcessing}
            onClick={() => onIncrease(item)}
          >
            <FaPlus />
          </button>
        </div>
      </td>

      <td className="fw-bold text-primary">
        Rs. {itemSubtotal.toLocaleString()}
      </td>

      <td className="pe-4">
        <button
          className="btn btn-danger btn-sm ripple"
          aria-label="Remove item"
          disabled={isProcessing}
          onClick={() => onRemove(item.id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
