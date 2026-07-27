function Hero() {
  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold">
              Shop Smart, Live Better
            </h1>

            <p className="lead text-muted mt-3">
              Discover amazing deals on electronics, fashion, home essentials,
              beauty products, and much more.
            </p>

            <button className="btn btn-primary btn-lg mt-3">
              Shop Now
            </button>
          </div>

          <div className="col-lg-6 text-center">
            <img
              src="https://placehold.co/600x400?text=Hero+Banner"
              className="img-fluid rounded"
              alt="Hero Banner"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;