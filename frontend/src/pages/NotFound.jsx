import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export default function NotFound() {
  return (
    <div className="app-page min-vh-100">
      <Navbar />
      <main className="container py-5">
        <section className="card glass-card empty-state mx-auto" style={{ maxWidth: "42rem" }}>
          <FaCompass className="display-4 text-primary mb-3" aria-hidden="true" />
          <span className="section-kicker">Error 404</span>
          <h1 className="h2 mt-2">Page not found</h1>
          <p className="text-muted">The page may have moved or the address may be incorrect.</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link className="btn btn-primary" to="/">Return home</Link>
            <Link className="btn btn-outline-primary" to="/products">Browse products</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
