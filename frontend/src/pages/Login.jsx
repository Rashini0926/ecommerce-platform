import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";


function Login() {

  const { login } = useAuth();

  const navigate = useNavigate();



  const handleLogin = (e) => {

    e.preventDefault();


    // Temporary user data
    // Later replace with backend API response

    const userData = {

      id: 1,

      name: "Rashini",

      email: "rashini@example.com",

      role: "CUSTOMER"

    };


    login(userData);


    navigate("/dashboard");

  };



  return (

    <div className="container mt-5">


      <div className="row justify-content-center">


        <div className="col-md-5">


          <div className="card shadow border-0">


            <div className="card-body p-4">


              <h2 className="text-center mb-4">

                Login

              </h2>



              <form onSubmit={handleLogin}>


                {/* Email */}

                <div className="input-group mb-3">


                  <span className="input-group-text">

                    <FaEnvelope />

                  </span>


                  <input

                    type="email"

                    className="form-control"

                    placeholder="Email Address"

                    required

                  />


                </div>




                {/* Password */}

                <div className="input-group mb-3">


                  <span className="input-group-text">

                    <FaLock />

                  </span>


                  <input

                    type="password"

                    className="form-control"

                    placeholder="Password"

                    required

                  />


                </div>





                {/* Remember + Forgot */}

                <div className="d-flex justify-content-between mb-3">


                  <div>

                    <input

                      type="checkbox"

                      className="me-2"

                    />

                    Remember me


                  </div>



                  <Link to="/forgot-password">

                    Forgot Password?

                  </Link>


                </div>





                <button

                  type="submit"

                  className="btn btn-primary w-100"

                >

                  Login

                </button>



              </form>





              <p className="text-center mt-3">


                Don't have an account?


                <Link to="/register">

                  {" "}Register

                </Link>


              </p>




            </div>


          </div>


        </div>


      </div>


    </div>

  );

}


export default Login;