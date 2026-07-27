import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaHeart,
  FaUser
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";


function Navbar() {

  const { user, logout } = useAuth();


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


            <button className="btn btn-primary ms-2">

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





            {
              user ? (

                <>


                  <li className="nav-item mx-2">

                    <Link
                      className="btn btn-outline-primary"
                      to="/dashboard"
                    >

                      Hi, {user.name}

                    </Link>

                  </li>



                  <li className="nav-item mx-2">

                    <button

                      className="btn btn-danger"

                      onClick={logout}

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

                      <FaUser className="me-1"/>

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


              )
            }



          </ul>


        </div>


      </div>


    </nav>

  );

}


export default Navbar;