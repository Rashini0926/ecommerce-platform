import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser,
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
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">

      <div className="container">

        <Link
          className="navbar-brand fw-bold text-primary fs-3"
          to="/"
        >
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

          <form className="d-flex mx-auto w-50">

            <input
              className="form-control"
              placeholder="Search products..."
            />

            <button
              className="btn btn-primary ms-2"
              type="submit"
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
                className="nav-link"
                to="/wishlist"
              >
                <FaHeart />
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className="nav-link"
                to="/cart"
              >
                <FaShoppingCart />
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
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
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
                    className="btn btn-primary"
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