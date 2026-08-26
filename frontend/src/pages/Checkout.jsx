import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getCart } from "../services/customerService";
import { createOrder } from "../services/orderService";
import api from "../utils/api";

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-LK")}`;

function Checkout() {
  const { token, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: user?.full_name || "",
    phone: user?.phone || "",
    city: "",
    address: "",
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const [response, addressResponse] = await Promise.all([getCart(token), api.get("/addresses", { headers: { Authorization: `Bearer ${token}` } })]);
        setCartItems(response.items || []);
        setAddresses(addressResponse.data.addresses || []);
      } catch (error) {
        showToast(error.response?.data?.message || "Could not load your cart.", "danger");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [token, showToast]);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.product?.price || 0) * item.quantity, 0),
    [cartItems]
  );

  const updateDeliveryDetail = (event) => {
    setDeliveryDetails({ ...deliveryDetails, [event.target.name]: event.target.value });
  };

  const selectAddress = (address) => setDeliveryDetails({ fullName: address.recipient_name, phone: address.phone, city: "", address: address.address });

  const placeOrder = async () => {
    if (Object.values(deliveryDetails).some((value) => !value.trim())) {
      showToast("Please complete all delivery information.", "danger");
      return;
    }

    const shippingAddress = [
      deliveryDetails.fullName,
      deliveryDetails.phone,
      deliveryDetails.address,
      deliveryDetails.city,
    ].join(", ");

    setIsSubmitting(true);

    try {
      const response = await createOrder(token, {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });

      showToast("Order placed successfully.", "success");
      navigate(`/order-success?order=${response.order.id}`, { state: { order: response.order } });
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const message = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : error.response?.data?.message || "Could not place your order. Please try again.";
      showToast(message, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <main className="container py-5"><LoadingSpinner text="Loading checkout" /></main>;
  }

  if (!cartItems.length) {
    return <main className="container py-5"><div className="card shadow-sm border-0 text-center p-5"><h2>Your cart is empty</h2><p className="text-muted">Add products before proceeding to checkout.</p><Link to="/products" className="btn btn-primary">Browse Products</Link></div></main>;
  }

  return <main className="container py-5">
    <h2 className="fw-bold mb-4">Checkout</h2>
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="card shadow-sm border-0"><div className="card-body p-4"><h4 className="mb-4">Delivery Information</h4>{addresses.length > 0 && <div className="mb-3"><label className="form-label">Saved address</label><select className="form-select" defaultValue="" onChange={(e) => { const item = addresses.find((address) => address.id === Number(e.target.value)); if (item) selectAddress(item); }}><option value="">Enter a new address</option>{addresses.map((address) => <option key={address.id} value={address.id}>{address.label} — {address.address}</option>)}</select></div>}<div className="row g-3">
          <div className="col-md-6"><label className="form-label">Full Name</label><input required name="fullName" className="form-control" value={deliveryDetails.fullName} onChange={updateDeliveryDetail} /></div>
          <div className="col-md-6"><label className="form-label">Phone Number</label><input required name="phone" className="form-control" value={deliveryDetails.phone} onChange={updateDeliveryDetail} /></div>
          <div className="col-12"><label className="form-label">City</label><input required name="city" className="form-control" value={deliveryDetails.city} onChange={updateDeliveryDetail} /></div>
          <div className="col-12"><label className="form-label">Delivery Address</label><textarea required name="address" className="form-control" rows="4" value={deliveryDetails.address} onChange={updateDeliveryDetail} /></div>
        </div></div></div>
        <div className="card shadow-sm border-0 mt-4"><div className="card-body p-4"><h4 className="mb-3">Payment Method</h4>
          <div className="form-check mb-3"><input className="form-check-input" id="cod" type="radio" value="COD" checked={paymentMethod === "COD"} onChange={(event) => setPaymentMethod(event.target.value)} /><label className="form-check-label" htmlFor="cod"><strong>Cash on Delivery</strong><small className="d-block text-muted">Pay when your order is delivered.</small></label></div>
          <div className="form-check"><input className="form-check-input" id="card" type="radio" value="CARD" checked={paymentMethod === "CARD"} onChange={(event) => setPaymentMethod(event.target.value)} /><label className="form-check-label" htmlFor="card"><strong>Card Payment (Demo)</strong><small className="d-block text-muted">A simulated successful payment for this academic project.</small></label></div>
        </div></div>
      </div>
      <div className="col-lg-5"><div className="card shadow-sm border-0 sticky-top" style={{ top: "90px" }}><div className="card-body p-4"><h4 className="mb-4">Order Summary</h4>
        {cartItems.map((item) => <div key={item.id} className="d-flex align-items-center mb-3"><img className="rounded me-3 object-fit-cover" width="64" height="64" src={item.product?.image || "https://via.placeholder.com/64?text=Product"} alt="" /><div className="flex-grow-1"><h6 className="mb-1">{item.product?.name}</h6><small className="text-muted">Quantity: {item.quantity}</small></div><strong>{formatPrice(Number(item.product?.price) * item.quantity)}</strong></div>)}
        <hr /><div className="d-flex justify-content-between mb-2"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="d-flex justify-content-between mb-2"><span>Shipping</span><span className="text-success">Free</span></div><hr /><div className="d-flex justify-content-between"><h5>Total</h5><h5 className="text-primary">{formatPrice(subtotal)}</h5></div>
        <button className="btn btn-success w-100 mt-4" type="button" disabled={isSubmitting} onClick={placeOrder}>{isSubmitting ? "Placing Order..." : "Place Order"}</button><Link to="/cart" className="btn btn-outline-secondary w-100 mt-2">Back to Cart</Link>
      </div></div></div>
    </div>
  </main>;
}

export default Checkout;
