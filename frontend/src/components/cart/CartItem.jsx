import {
  FaPlus,
  FaMinus,
  FaTrash,
} from "react-icons/fa";

function CartItem({ item }) {
  return (
    <tr>
      <td>
        <img
          src={item.image}
          alt={item.name}
          width="70"
        />
      </td>

      <td>{item.name}</td>

      <td>Rs. {item.price.toLocaleString()}</td>

      <td>

        <button className="btn btn-sm btn-outline-secondary me-2">
          <FaMinus />
        </button>

        {item.quantity}

        <button className="btn btn-sm btn-outline-secondary ms-2">
          <FaPlus />
        </button>

      </td>

      <td>
        Rs. {(item.price * item.quantity).toLocaleString()}
      </td>

      <td>

        <button className="btn btn-danger btn-sm">
          <FaTrash />
        </button>

      </td>
    </tr>
  );
}

export default CartItem;