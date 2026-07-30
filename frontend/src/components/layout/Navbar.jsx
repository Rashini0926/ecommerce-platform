import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaStore,
  FaSignOutAlt,
  FaBell,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { logoutUser } from "../../services/authService";
import LoadingSpinner from "../common/LoadingSpinner";
import { useState } from "react";

function Navbar() {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isSeller = user?.role === "seller" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.log(error);
      showToast("Logout request failed, but your session was cleared.", "danger");
    }

    logout();
    showToast("You have been logged out.", "info");
    navigate("/login");
    setIsLoggingOut(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm) {
      navigate(`/products?search=${encodeURIComponent(trimmedSearchTerm)}`);
    } else {
      navigate("/products");
    }
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

          <form className="d-flex mx-auto w-50 search-pill" onSubmit={handleSearch}>

            <input
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              className="btn btn-primary ms-2 ripple"
              type="submit"
              aria-label="Search"
            >
              <FaSearch />
            </button>

          </form>

          <ul className="navbar-nav navbar-actions ms-auto align-items-center">

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
                to="/notifications"
                aria-label="Notifications"
              >
                <FaBell />
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                  4
                </span>
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

                {isAdmin && (
                  <li className="nav-item mx-2">
                    <Link
                      className="btn btn-outline-danger"
                      to="/admin/dashboard"
                    >
                      <FaShieldAlt className="me-2" />
                      Admin
                    </Link>
                  </li>
                )}

                {isSeller && (
                  <li className="nav-item mx-2">

                    <Link
                      className="btn btn-outline-success"
                      to="/seller/dashboard"
                    >
                      <FaChartLine className="me-2" />
                      Seller
                    </Link>

                  </li>
                )}

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
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <LoadingSpinner text="Logging out" />
                    ) : (
                      <>
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </>
                    )}
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
