import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldAlt, FaShippingFast } from "react-icons/fa";

function Hero() {
  return (
    <section className="hero-section app-page">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 slide-up">
            <span className="section-kicker">Premium online marketplace</span>

            <h1 className="hero-title mt-3 mb-4">
              Shop Smart, Live Better
            </h1>

            <p className="hero-copy">
              Discover amazing deals on electronics, fashion, home essentials,
              beauty products, and much more.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link to="/products" className="btn btn-primary btn-lg pulse-button ripple">
                Shop Now
                <FaArrowRight className="ms-2" />
              </Link>

              <Link to="/register" className="btn btn-outline-primary btn-lg">
                Create Account
              </Link>
            </div>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <span className="badge badge-soft-primary">
                <FaShippingFast className="me-2" />
                Fast delivery
              </span>

              <span className="badge badge-soft-success">
                <FaShieldAlt className="me-2" />
                Secure checkout
              </span>
            </div>
          </div>

          <div className="col-lg-6 slide-up">
            <div className="hero-media image-zoom">
              <img
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1200&q=80"
                className="h-100"
                alt="Online shopping products"
              />

              <div className="hero-overlay">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-white-50">Today only</small>
                    <h5 className="mb-0 text-white">Up to 40% off</h5>
                  </div>

                  <span className="badge bg-warning text-dark">Hot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
