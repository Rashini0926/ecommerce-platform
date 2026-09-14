import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaCreditCard,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";
import "./DemoPayment.css";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  completeDemoPayment,
  getOrder,
  initiateDemoPayment,
} from "../services/orderService";

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const apiMessage = (error, fallback) => {
  const validationErrors = error.response?.data?.errors;
  return validationErrors
    ? Object.values(validationErrors).flat()[0]
    : error.response?.data?.message || fallback;
};

function DemoPayment() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();
  const initialOrder = String(location.state?.order?.id) === String(id)
    ? location.state.order
    : null;

  const [order, setOrder] = useState(initialOrder);
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [card, setCard] = useState({
    holderName: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    let cancelled = false;

    const preparePayment = async () => {
      try {
        const orderResponse = await getOrder(token, id);
        const loadedOrder = orderResponse.order;

        if (loadedOrder.payment_method !== "CARD") {
          throw new Error("This order does not require a card payment.");
        }

        const paymentResponse = await initiateDemoPayment(token, id);

        if (!cancelled) {
          setOrder(paymentResponse.order || loadedOrder);
          setPayment(paymentResponse.payment);
          setLoadError("");
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(apiMessage(error, error.message || "Unable to prepare the demo payment."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    preparePayment();

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const updateCard = (field, value) => {
    let normalizedValue = value;

    if (field === "number") {
      normalizedValue = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (field === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      normalizedValue = digits.length > 2
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : digits;
    }

    if (field === "cvv") {
      normalizedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCard((current) => ({ ...current, [field]: normalizedValue }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateCard = () => {
    const errors = {};
    const cardNumber = card.number.replace(/\s/g, "");

    if (card.holderName.trim().length < 2) {
      errors.holderName = "Enter the cardholder name.";
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      errors.number = "Enter a valid 16-digit demo card number.";
    }

    const expiryMatch = card.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
      errors.expiry = "Use MM/YY format.";
    } else {
      const month = Number(expiryMatch[1]);
      const year = 2000 + Number(expiryMatch[2]);
      const now = new Date();
      const hasExpired = year < now.getFullYear() ||
        (year === now.getFullYear() && month < now.getMonth() + 1);

      if (month < 1 || month > 12 || hasExpired) {
        errors.expiry = "Enter a valid future expiry date.";
      }
    }

    if (!/^\d{3,4}$/.test(card.cvv)) {
      errors.cvv = "Enter a valid 3 or 4-digit CVV.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!validateCard()) return;

    setIsProcessing(true);

    try {
      const response = await completeDemoPayment(token, id);
      showToast(response.message, "success");
      navigate(`/order-success?order=${response.order.id}`, {
        replace: true,
        state: { order: response.order },
      });
    } catch (error) {
      showToast(apiMessage(error, "Unable to complete the demo payment."), "danger");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="app-page demo-payment-page">
        <Navbar />
        <main className="container demo-payment-main">
          <div className="demo-payment-state"><LoadingSpinner size="lg" text="Preparing secure demo payment..." /></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loadError || !order || !payment) {
    return (
      <div className="app-page demo-payment-page">
        <Navbar />
        <main className="container demo-payment-main">
          <div className="demo-payment-state">
            <FaCreditCard />
            <h1>Payment unavailable</h1>
            <p>{loadError || "The payment details could not be loaded."}</p>
            <Link to={`/orders/${id}`} className="btn btn-primary rounded-pill px-4">View Order</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (payment.status === "PAID" || order.payment_status === "PAID") {
    return (
      <div className="app-page demo-payment-page">
        <Navbar />
        <main className="container demo-payment-main">
          <div className="demo-payment-state demo-payment-complete">
            <FaCheck />
            <h1>Payment already completed</h1>
            <p>Order {order.order_number} has already been paid successfully.</p>
            <Link to={`/order-success?order=${order.id}`} state={{ order }} className="btn btn-success rounded-pill px-4">View Confirmation</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-page demo-payment-page">
      <Navbar />

      <main className="container demo-payment-main">
        <Link to={`/orders/${id}`} className="demo-payment-back">
          <FaArrowLeft />Back to order
        </Link>

        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-7">
            <section className="demo-payment-card">
              <div className="demo-payment-heading">
                <span className="demo-payment-icon"><FaCreditCard /></span>
                <div>
                  <span className="section-kicker">Academic sandbox</span>
                  <h1>Demo Card Payment</h1>
                </div>
              </div>

              <div className="demo-payment-notice">
                <FaShieldAlt />
                <div>
                  <strong>No real payment is processed</strong>
                  <span>Use any valid-format test card details. The values remain in your browser and are never sent to the API.</span>
                </div>
              </div>

              <form className="demo-card-form" onSubmit={handlePayment} noValidate>
                <div className="demo-form-field">
                  <label htmlFor="card-holder">Cardholder name</label>
                  <input
                    id="card-holder"
                    type="text"
                    autoComplete="cc-name"
                    value={card.holderName}
                    onChange={(event) => updateCard("holderName", event.target.value)}
                    placeholder="Name shown on card"
                    aria-invalid={Boolean(formErrors.holderName)}
                  />
                  {formErrors.holderName && <small>{formErrors.holderName}</small>}
                </div>

                <div className="demo-form-field">
                  <label htmlFor="card-number">Card number</label>
                  <div className="demo-input-with-icon">
                    <FaCreditCard />
                    <input
                      id="card-number"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={card.number}
                      onChange={(event) => updateCard("number", event.target.value)}
                      placeholder="4242 4242 4242 4242"
                      aria-invalid={Boolean(formErrors.number)}
                    />
                  </div>
                  {formErrors.number && <small>{formErrors.number}</small>}
                </div>

                <div className="demo-form-row">
                  <div className="demo-form-field">
                    <label htmlFor="card-expiry">Expiry</label>
                    <input
                      id="card-expiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      value={card.expiry}
                      onChange={(event) => updateCard("expiry", event.target.value)}
                      placeholder="MM/YY"
                      aria-invalid={Boolean(formErrors.expiry)}
                    />
                    {formErrors.expiry && <small>{formErrors.expiry}</small>}
                  </div>
                  <div className="demo-form-field">
                    <label htmlFor="card-cvv">CVV</label>
                    <input
                      id="card-cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      value={card.cvv}
                      onChange={(event) => updateCard("cvv", event.target.value)}
                      placeholder="123"
                      aria-invalid={Boolean(formErrors.cvv)}
                    />
                    {formErrors.cvv && <small>{formErrors.cvv}</small>}
                  </div>
                </div>

                <button className="demo-pay-button" type="submit" disabled={isProcessing}>
                  <FaLock />
                  {isProcessing ? "Processing demo payment..." : `Pay LKR ${formatPrice(order.total_amount)}`}
                </button>
              </form>
            </section>
          </div>

          <div className="col-12 col-lg-5">
            <aside className="demo-order-summary">
              <span className="section-kicker">Payment summary</span>
              <h2>Order {order.order_number}</h2>
              <div className="demo-order-items">
                {(order.items || []).map((item) => (
                  <div key={item.id}>
                    <span>{item.product_name}<small>Qty {item.quantity}</small></span>
                    <strong>LKR {formatPrice(item.subtotal)}</strong>
                  </div>
                ))}
              </div>
              <div className="demo-payment-total">
                <span>Total due</span>
                <strong>LKR {formatPrice(order.total_amount)}</strong>
              </div>
              <dl className="demo-payment-reference">
                <div><dt>Provider</dt><dd>{payment.provider}</dd></div>
                <div><dt>Reference</dt><dd>{payment.reference}</dd></div>
                <div><dt>Status</dt><dd>{payment.status}</dd></div>
              </dl>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DemoPayment;
