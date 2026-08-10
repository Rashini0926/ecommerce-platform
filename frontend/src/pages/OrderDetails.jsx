import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  return (
    <div className="container py-5">
      <h2>Order Details</h2>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5>Order ID: {id}</h5>
          <p className="text-muted">
            Order details page is under development.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;