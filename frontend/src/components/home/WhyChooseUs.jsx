import {
  FaBell,
  FaShieldAlt,
  FaShippingFast,
  FaStar,
} from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaShippingFast />,
    title: "Fast Delivery",
    description: "Islandwide delivery with quick and reliable shipping.",
    tone: "primary",
  },
  {
    id: 2,
    icon: <FaShieldAlt />,
    title: "Safe Demo Checkout",
    description: "Protected checkout flow with card simulation and cash on delivery.",
    tone: "success",
  },
  {
    id: 3,
    icon: <FaBell />,
    title: "Order Notifications",
    description: "Receive in-app, email, and demo SMS updates as orders progress.",
    tone: "accent",
  },
  {
    id: 4,
    icon: <FaStar />,
    title: "Verified Reviews",
    description: "Product ratings are accepted from customers with delivered purchases.",
    tone: "danger",
  },
];

function WhyChooseUs() {
  return (
    <section className="container section-padding">
      <div className="text-center mb-5">
        <span className="section-kicker">Service promise</span>
        <h2 className="fw-bold mt-2">Why Choose ShopEase?</h2>
        <p className="text-muted">
          Quality products, reliable service, and a smoother shopping experience.
        </p>
      </div>

      <div className="row g-4">
        {features.map((feature) => (
          <div className="col-md-6 col-lg-3" key={feature.id}>
            <div className="card glass-card h-100 text-center p-4 hover-lift card-hover-shadow">
              <div className={`icon-circle fs-3 mx-auto mb-3 text-${feature.tone}`}>
                {feature.icon}
              </div>
              <h5>{feature.title}</h5>
              <p className="text-muted mb-0">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
