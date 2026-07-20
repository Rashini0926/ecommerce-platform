function Newsletter() {
  return (
    <section className="bg-primary text-white py-5">

      <div className="container text-center">

        <h2 className="fw-bold">
          Stay Updated!
        </h2>

        <p className="mb-4">
          Subscribe to receive the latest offers, discounts, and new product updates.
        </p>

        <form className="row justify-content-center">

          <div className="col-md-6 mb-3">

            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email address"
            />

          </div>

          <div className="col-auto">

            <button
              type="submit"
              className="btn btn-light btn-lg"
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