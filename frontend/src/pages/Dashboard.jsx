import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


function Dashboard() {

  const { user } = useAuth();


  return (

    <div className="container mt-5">


      <div className="row">


        <div className="col-md-4">


          <div className="card shadow-sm">

            <div className="card-body text-center">


              <h5>
                Welcome
              </h5>


              <h4 className="text-primary">
                {user?.name}
              </h4>


              <p>
                {user?.email}
              </p>


              <span className="badge bg-success">
                {user?.role}
              </span>


            </div>


          </div>


        </div>




        <div className="col-md-8">


          <div className="card shadow-sm">


            <div className="card-body">


              <h3>
                Customer Dashboard
              </h3>


              <hr />


              <div className="row">


                <div className="col-md-4 mb-3">

                  <Link
                    to="/orders"
                    className="btn btn-outline-primary w-100"
                  >
                    My Orders
                  </Link>

                </div>



                <div className="col-md-4 mb-3">

                  <Link
                    to="/wishlist"
                    className="btn btn-outline-danger w-100"
                  >
                    Wishlist
                  </Link>

                </div>



                <div className="col-md-4 mb-3">

                  <Link
                    to="/cart"
                    className="btn btn-outline-success w-100"
                  >
                    Cart
                  </Link>

                </div>


              </div>


            </div>


          </div>


        </div>


      </div>


    </div>

  );

}


export default Dashboard;