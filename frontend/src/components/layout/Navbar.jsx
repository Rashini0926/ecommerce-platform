import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          ShopEase
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <form className="d-flex mx-auto w-50">
            <input
              className="form-control"
              type="search"
              placeholder="Search products..."
            />
            <button className="btn btn-primary ms-2">
              <FaSearch />
            </button>
          </form>

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/wishlist">
                <FaHeart />
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link" to="/cart">
                <FaShoppingCart />
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="btn btn-outline-primary" to="/login">
                <FaUser className="me-1" />
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;