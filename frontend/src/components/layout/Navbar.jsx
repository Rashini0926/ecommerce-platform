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

import {
  logoutUser,
} from "../../services/authService";

import {
  getCart,
} from "../../services/cartService";

import LoadingSpinner from "../common/LoadingSpinner";

import {
  useEffect,
  useState,
} from "react";


function Navbar() {
  const {
    user,
    token,
    logout,
  } = useAuth();

  const {
    showToast,
  } = useToast();

  const navigate =
    useNavigate();


  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [
    isLoggingOut,
    setIsLoggingOut,
  ] = useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    cartCount,
    setCartCount,
  ] = useState(0);


  /*
  |--------------------------------------------------------------------------
  | USER ROLE
  |--------------------------------------------------------------------------
  */

  const userRole =
    user?.role?.toLowerCase() ||
    "guest";

  const isCustomer =
    userRole === "customer";

  const isSeller =
    userRole === "seller";

  const isAdmin =
    userRole === "admin";


  /*
  |--------------------------------------------------------------------------
  | LOAD CART COUNT
  |--------------------------------------------------------------------------
  */

  const loadCartCount =
    async () => {

      /*
       * Guests do not have
       * authenticated server carts.
       */

      if (!user || !token) {

        setCartCount(0);

        return;
      }


      /*
       * Only customers need cart count.
       */

      if (!isCustomer) {

        setCartCount(0);

        return;
      }


      try {

        const data =
          await getCart();


        /*
         * Current CartController returns:
         *
         * {
         *   success: true,
         *   items: [...]
         * }
         */

        const items =
          data?.items ||
          data?.cart ||
          data?.cart_items ||
          (
            Array.isArray(data)
              ? data
              : []
          );


        /*
         * Count TOTAL quantities.
         *
         * Example:
         *
         * Product A = 2
         * Product B = 3
         *
         * Badge = 5
         */

        const count =
          items.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.quantity ||
                0
              ),
            0
          );


        setCartCount(
          count
        );

      } catch (error) {

        console.error(
          "Failed to load cart count:",
          error
        );


        /*
         * Avoid displaying
         * old incorrect count.
         */

        setCartCount(0);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | LOAD CART COUNT WHEN USER CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadCartCount();

  }, [
    user,
    token,
    isCustomer,
  ]);


  /*
  |--------------------------------------------------------------------------
  | LISTEN FOR CART UPDATES
  |--------------------------------------------------------------------------
  |
  | ProductDetails and Cart page
  | dispatch this event whenever
  | cart data changes.
  |
  */

  useEffect(() => {

    const handleCartUpdated =
      () => {

        loadCartCount();

      };


    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );


    return () => {

      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );

    };

  }, [
    user,
    token,
    isCustomer,
  ]);


  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout =
    async () => {

      setIsLoggingOut(true);


      try {

        if (token) {

          await logoutUser(
            token
          );

        }

      } catch (error) {

        console.log(
          error
        );

        showToast(
          "Logout request failed, but your session was cleared.",
          "danger"
        );

      }


      /*
       * Clear frontend auth
       */

      logout();


      /*
       * Clear cart badge
       */

      setCartCount(0);


      showToast(
        "You have been logged out.",
        "info"
      );


      navigate(
        "/login"
      );


      setIsLoggingOut(
        false
      );
    };


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch =
    (e) => {

      e.preventDefault();


      const trimmedSearchTerm =
        searchTerm.trim();


      if (
        trimmedSearchTerm
      ) {

        navigate(
          `/products?search=${encodeURIComponent(
            trimmedSearchTerm
          )}`
        );

      } else {

        navigate(
          "/products"
        );

      }
    };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <nav className="navbar navbar-expand-lg app-navbar py-3">

      <div className="container">


        {/* ================================================================
            LOGO
        ================================================================ */}

        <Link
          className="navbar-brand fw-bold fs-3 d-flex align-items-center gap-2"
          to={
            isAdmin
              ? "/admin/dashboard"
              : isSeller
              ? "/seller/dashboard"
              : "/"
          }
        >

          <span
            className="icon-circle"
            style={{
              width:
                "2.4rem",
              height:
                "2.4rem",
            }}
          >

            {isAdmin ? (

              <FaShieldAlt />

            ) : (

              <FaStore />

            )}

          </span>


          ShopEase{" "}

          {isAdmin
            ? "Admin"
            : isSeller
            ? "Seller Center"
            : ""}

        </Link>


        {/* ================================================================
            MOBILE TOGGLE
        ================================================================ */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >

          <span className="navbar-toggler-icon"></span>

        </button>


        {/* ================================================================
            NAVBAR CONTENT
        ================================================================ */}

        <div
          className="collapse navbar-collapse"
          id="navbarMenu"
        >


          {/* --------------------------------------------------------------
              SEARCH
          -------------------------------------------------------------- */}

          <form
            className="d-flex mx-auto w-50 search-pill"
            onSubmit={
              handleSearch
            }
          >

            <input
              className="form-control"
              placeholder="Search products..."
              value={
                searchTerm
              }
              onChange={(
                e
              ) =>
                setSearchTerm(
                  e.target.value
                )
              }
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


            {/* ============================================================
                PRODUCTS
            ============================================================ */}

            {(
              !user ||
              isCustomer
            ) && (

              <li className="nav-item mx-2">

                <Link
                  className="nav-link"
                  to="/products"
                >

                  Products

                </Link>

              </li>

            )}


            {/* ============================================================
                NOTIFICATIONS
            ============================================================ */}

            {user && (

              <li className="nav-item mx-2">

                <Link
                  className="nav-link position-relative"
                  to="/notifications"
                  aria-label="Notifications"
                >

                  <FaBell />


                  <span
                    className="position-absolute top-0 start-100 translate-middle badge bg-danger"
                  >

                    {isAdmin
                      ? "5"
                      : isSeller
                      ? "2"
                      : "4"}

                  </span>

                </Link>

              </li>

            )}


            {/* ============================================================
                WISHLIST + CART
            ============================================================ */}

            {(
              !user ||
              isCustomer
            ) && (

              <>

                {/* Wishlist */}

                <li className="nav-item mx-2">

                  <Link
                    className="nav-link position-relative"
                    to="/wishlist"
                    aria-label="Wishlist"
                  >

                    <FaHeart />


                    <span
                      className="position-absolute top-0 start-100 translate-middle badge bg-danger"
                    >

                      3

                    </span>

                  </Link>

                </li>


                {/* ========================================================
                    CART
                ======================================================== */}

                <li className="nav-item mx-2">

                  <Link
                    className="nav-link position-relative"
                    to="/cart"
                    aria-label={`Cart with ${cartCount} items`}
                  >

                    <FaShoppingCart />


                    {/* Show badge only when cart contains items */}

                    {cartCount > 0 && (

                      <span
                        className="position-absolute top-0 start-100 translate-middle badge bg-primary"
                      >

                        {
                          cartCount >
                          99
                            ? "99+"
                            : cartCount
                        }

                      </span>

                    )}

                  </Link>

                </li>

              </>

            )}


            {/* ============================================================
                USER AUTHENTICATED
            ============================================================ */}

            {user ? (

              <>

                {/* --------------------------------------------------------
                    ADMIN
                -------------------------------------------------------- */}

                {isAdmin && (

                  <li className="nav-item mx-2">

                    <Link
                      className="btn btn-outline-danger"
                      to="/admin/dashboard"
                    >

                      <FaShieldAlt className="me-2" />

                      Admin Console

                    </Link>

                  </li>

                )}


                {/* --------------------------------------------------------
                    SELLER
                -------------------------------------------------------- */}

                {isSeller && (

                  <li className="nav-item mx-2">

                    <Link
                      className="btn btn-outline-success"
                      to="/seller/dashboard"
                    >

                      <FaChartLine className="me-2" />

                      Seller Workspace

                    </Link>

                  </li>

                )}


                {/* --------------------------------------------------------
                    CUSTOMER
                -------------------------------------------------------- */}

                {isCustomer && (

                  <li className="nav-item mx-2">

                    <Link
                      className="btn btn-outline-primary"
                      to="/dashboard"
                    >

                      Hi,{" "}

                      {
                        user.full_name ||
                        "Customer"
                      }

                    </Link>

                  </li>

                )}


                {/* --------------------------------------------------------
                    LOGOUT
                -------------------------------------------------------- */}

                <li className="nav-item mx-2">

                  <button
                    className="btn btn-danger ripple"
                    onClick={
                      handleLogout
                    }
                    disabled={
                      isLoggingOut
                    }
                  >

                    {isLoggingOut ? (

                      <LoadingSpinner
                        text="Logging out"
                      />

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

              /* ==========================================================
                 GUEST
              ========================================================== */

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