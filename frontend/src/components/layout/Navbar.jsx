import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaStore,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.log(error);
    }

    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar py-3">

      <div className="container">

        <Link
          className="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2"
          to="/"
        >
          <span className="icon-circle" style={{ width: "2.4rem", height: "2.4rem" }}>
            <FaStore />
          </span>
          ShopEase
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarMenu"
        >

          <form className="d-flex mx-auto w-50 search-pill">

            <input
              className="form-control"
              placeholder="Search products..."
            />

            <button
              className="btn btn-primary ms-2 ripple"
              type="submit"
              aria-label="Search"
            >
              <FaSearch />
            </button>

          </form>

          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item mx-2">
              <Link
                className="nav-link"
                to="/products"
              >
                Products
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className="nav-link position-relative"
                to="/wishlist"
                aria-label="Wishlist"
              >
                <FaHeart />
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                  3
                </span>
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className="nav-link position-relative"
                to="/cart"
                aria-label="Cart"
              >
                <FaShoppingCart />
                <span className="position-absolute top-0 start-100 translate-middle badge bg-primary">
                  2
                </span>
              </Link>
            </li>

            {user ? (
              <>

                <li className="nav-item mx-2">

                  <Link
                    className="btn btn-outline-primary"
                    to="/dashboard"
                  >
                    Hi, {user.full_name}
                  </Link>

                </li>

                <li className="nav-item mx-2">

                  <button
                    className="btn btn-danger ripple"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>

                </li>

              </>
            ) : (
              <>

                <li className="nav-item mx-2">

                  <Link
                    className="btn btn-outline-primary"
                    to="/login"
                  >
                    <FaUser className="me-1" />
                    Login
                  </Link>

                </li>

                <li className="nav-item mx-2">

                  <Link
                    className="btn btn-primary ripple"
                    to="/register"
                  >
                    Register
                  </Link>

                </li>

              </>
            )}

          </ul>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
