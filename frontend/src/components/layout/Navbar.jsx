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
import api from "../../utils/api";
import { ACCOUNT_COUNTS_EVENT, refreshAccountCounts } from "../../utils/accountEvents";
import LoadingSpinner from "../common/LoadingSpinner";
import { useEffect, useState } from "react";

function Navbar() {
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [counts, setCounts] = useState({ notifications: 0, wishlist: 0, cart: 0 });
  const navigate = useNavigate();

  const userRole = user?.role || "guest";
  const isCustomer = userRole === "customer";
  const isSeller = userRole === "seller";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      if (!token || !user) {
        if (!cancelled) setCounts({ notifications: 0, wishlist: 0, cart: 0 });
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await api.get("/account/summary", config);
        if (cancelled) return;
        const accountCounts = response.data.counts || {};
        setCounts({
          notifications: Number(accountCounts.unread_notifications || 0),
          wishlist: Number(accountCounts.wishlist_items || 0),
          cart: Number(accountCounts.cart_items || 0),
        });
      } catch {
        if (!cancelled) setCounts({ notifications: 0, wishlist: 0, cart: 0 });
      }
    };

    loadCounts();
    window.addEventListener(ACCOUNT_COUNTS_EVENT, loadCounts);

    return () => {
      cancelled = true;
      window.removeEventListener(ACCOUNT_COUNTS_EVENT, loadCounts);
    };
  }, [isCustomer, token, user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      if (token) {
        await logoutUser(token);
      }
    } catch {
      showToast("Logout request failed, but your session was cleared.", "danger");
    }

    logout();
    refreshAccountCounts();
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
          to={isAdmin ? "/admin/dashboard" : isSeller ? "/seller/dashboard" : "/"}
        >
          <span className="icon-circle" style={{ width: "2.4rem", height: "2.4rem" }}>
            {isAdmin ? <FaShieldAlt /> : isSeller ? <FaStore /> : <FaStore />}
          </span>
          ShopEase {isAdmin ? "Admin" : isSeller ? "Seller Center" : ""}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
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
            {/* Products link visible to Customers and Guests */}
            {(!user || isCustomer) && (
              <li className="nav-item mx-2">
                <Link className="nav-link" to="/products">
                  Products
                </Link>
              </li>
            )}

            {/* Notifications link for all logged in roles */}
            {user && (
              <li className="nav-item mx-2">
                <Link
                  className="nav-link position-relative"
                  to="/notifications"
                  aria-label="Notifications"
                >
                  <FaBell />
                  {counts.notifications > 0 && <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">{badgeCount(counts.notifications)}</span>}
                </Link>
              </li>
            )}

            {/* Wishlist & Cart: ONLY visible for Customer or Guest (Daraz style: Hidden for Seller & Admin) */}
            {(!user || isCustomer) && (
              <>
                <li className="nav-item mx-2">
                  <Link
                    className="nav-link position-relative"
                    to="/wishlist"
                    aria-label="Wishlist"
                  >
                    <FaHeart />
                    {isCustomer && counts.wishlist > 0 && <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">{badgeCount(counts.wishlist)}</span>}
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link
                    className="nav-link position-relative"
                    to="/cart"
                    aria-label="Cart"
                  >
                    <FaShoppingCart />
                    {isCustomer && counts.cart > 0 && <span className="position-absolute top-0 start-100 translate-middle badge bg-primary">{badgeCount(counts.cart)}</span>}
                  </Link>
                </li>
              </>
            )}

            {/* Role-Specific Navigation & Profile Controls */}
            {user ? (
              <>
                {/* Admin Navigation */}
                {isAdmin && (
                  <li className="nav-item mx-2">
                    <Link className="btn btn-outline-danger" to="/admin/dashboard">
                      <FaShieldAlt className="me-2" />
                      Admin Console
                    </Link>
                  </li>
                )}

                {/* Seller Navigation */}
                {isSeller && (
                  <li className="nav-item mx-2">
                    <Link className="btn btn-outline-success" to="/seller/dashboard">
                      <FaChartLine className="me-2" />
                      Seller Workspace
                    </Link>
                  </li>
                )}

                {/* Customer Navigation */}
                {isCustomer && (
                  <li className="nav-item mx-2">
                    <Link className="btn btn-outline-primary" to="/dashboard">
                      Hi, {user.full_name || "Customer"}
                    </Link>
                  </li>
                )}

                {/* Logout Button */}
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
                  <Link className="btn btn-outline-primary" to="/login">
                    <FaUser className="me-1" />
                    Login
                  </Link>
                </li>

                <li className="nav-item mx-2">
                  <Link className="btn btn-primary ripple" to="/register">
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

function badgeCount(count) {
  return count > 99 ? "99+" : count;
}
