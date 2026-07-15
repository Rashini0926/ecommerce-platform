import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaShoppingCart, 
  FaHeart, 
  FaUser 
} from "react-icons/fa";


function Navbar() {

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">

      <div className="container">

        {/* Brand */}
        <Link 
          className="navbar-brand fw-bold text-primary fs-3"
          to="/"
        >
          ShopEase
        </Link>


        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >

          <span className="navbar-toggler-icon"></span>

        </button>


        {/* Navbar Content */}
        <div 
          className="collapse navbar-collapse"
          id="navbarMenu"
        >


          {/* Search Bar */}
          <form className="d-flex mx-auto w-50">

            <input
              className="form-control"
              type="search"
              placeholder="Search products..."
            />

            <button 
              className="btn btn-primary ms-2"
              type="button"
            >
              <FaSearch />
            </button>

          </form>



          {/* Menu Items */}
          <ul className="navbar-nav ms-auto align-items-center">


            {/* Home */}
            <li className="nav-item mx-2">

              <Link 
                className="nav-link"
                to="/"
              >
                Home
              </Link>

            </li>



            {/* Products */}
            <li className="nav-item mx-2">

              <Link 
                className="nav-link"
                to="/products"
              >
                Products
              </Link>

            </li>



            {/* Wishlist */}
            <li className="nav-item mx-2">

              <Link 
                className="nav-link"
                to="/wishlist"
              >

                <FaHeart />

              </Link>

            </li>



            {/* Cart */}
            <li className="nav-item mx-2">

              <Link 
                className="nav-link"
                to="/cart"
              >

                <FaShoppingCart />

              </Link>

            </li>



            {/* Login */}
            <li className="nav-item mx-2">

              <Link
                className="btn btn-outline-primary"
                to="/login"
              >

                <FaUser className="me-1" />

                Login

              </Link>

            </li>



            {/* Register */}
            <li className="nav-item mx-2">

              <Link
                className="btn btn-primary"
                to="/register"
              >

                Register

              </Link>

            </li>


          </ul>


        </div>


      </div>


    </nav>

  );

}


export default Navbar;