import { FaEnvelopeOpenText } from "react-icons/fa";

function Newsletter() {
  return (
    <section className="container section-padding">
      <div className="glass-card p-4 p-lg-5 text-center slide-up">
        <div className="icon-circle fs-3 mb-3">
          <FaEnvelopeOpenText />
        </div>

        <h2 className="fw-bold">
          Stay Updated
        </h2>

        <p className="text-muted mb-4">
          Subscribe to receive the latest offers, discounts, and new product updates.
        </p>

        <form className="row justify-content-center g-3">
          <div className="col-md-7 col-lg-6">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email address"
            />
          </div>

          <div className="col-md-auto">
            <button
              type="submit"
              className="btn btn-primary btn-lg ripple"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
