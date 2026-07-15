import { FaEnvelope, FaLock } from "react-icons/fa";


function Login() {

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow border-0">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Login
              </h2>


              <div className="input-group mb-3">

                <span className="input-group-text">
                  <FaEnvelope />
                </span>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                />

              </div>



              <div className="input-group mb-3">

                <span className="input-group-text">
                  <FaLock />
                </span>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                />

              </div>



              <div className="d-flex justify-content-between mb-3">

                <div>
                  <input type="checkbox" /> Remember me
                </div>

                <a href="#">
                  Forgot Password?
                </a>

              </div>



              <button className="btn btn-primary w-100">
                Login
              </button>


              <p className="text-center mt-3">

                Don't have an account?

                <a href="/register">
                  Register
                </a>

              </p>


            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;