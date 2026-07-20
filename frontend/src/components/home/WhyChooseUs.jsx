import {
  FaShippingFast,
  FaShieldAlt,
  FaHeadset,
  FaUndo,
} from "react-icons/fa";

const features = [
  {
    id: 1,
    icon: <FaShippingFast size={45} className="text-primary mb-3" />,
    title: "Fast Delivery",
    description: "Islandwide delivery with quick and reliable shipping.",
  },
  {
    id: 2,
    icon: <FaShieldAlt size={45} className="text-success mb-3" />,
    title: "Secure Payment",
    description: "100% secure online payment with trusted payment gateways.",
  },
  {
    id: 3,
    icon: <FaHeadset size={45} className="text-warning mb-3" />,
    title: "24/7 Support",
    description: "Our customer support team is available anytime to help you.",
  },
  {
    id: 4,
    icon: <FaUndo size={45} className="text-danger mb-3" />,
    title: "Easy Returns",
    description: "Hassle-free returns and refunds within the return period.",
  },
];

function WhyChooseUs() {
  return (
    <section className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Why Choose ShopEase?</h2>
        <p className="text-muted">
          We provide quality products and an excellent shopping experience.
        </p>
      </div>

      <div className="row">
        {features.map((feature) => (
          <div className="col-md-6 col-lg-3 mb-4" key={feature.id}>
            <div className="card h-100 shadow-sm border-0 text-center p-4">
              {feature.icon}
              <h5>{feature.title}</h5>
              <p className="text-muted">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;