import {
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

function CartItem({ item }) {
  return (
    <tr>
      <td>
        <img
          src={item.image}
          alt={item.name}
          className="cart-image rounded-4"
          width="72"
          height="72"
        />
      </td>

      <td>
        <div className="fw-bold">{item.name}</div>
        <small className="text-muted">In stock</small>
      </td>

      <td className="fw-semibold">Rs. {item.price.toLocaleString()}</td>

      <td>
        <div className="quantity-control">
          <button className="btn btn-sm btn-outline-secondary" aria-label="Decrease quantity">
            <FaMinus />
          </button>

          <span className="fw-bold px-1">{item.quantity}</span>

          <button className="btn btn-sm btn-outline-secondary" aria-label="Increase quantity">
            <FaPlus />
          </button>
        </div>
      </td>

      <td className="fw-bold text-primary">
        Rs. {(item.price * item.quantity).toLocaleString()}
      </td>

      <td>
        <button className="btn btn-danger btn-sm ripple" aria-label="Remove item">
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}

export default CartItem;
