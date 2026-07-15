import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock 
} from "react-icons/fa";


function Register() {

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow border-0">

            <div className="card-body p-4">


              <h2 className="text-center mb-4">
                Create Account
              </h2>



              {/* Full Name */}

              <div className="input-group mb-3">

                <span className="input-group-text">
                  <FaUser />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                />

              </div>



              {/* Email */}

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



              {/* Phone */}

              <div className="input-group mb-3">

                <span className="input-group-text">
                  <FaPhone />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone Number"
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
                />

              </div>



              {/* Confirm Password */}

              <div className="input-group mb-3">

                <span className="input-group-text">
                  <FaLock />
                </span>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                />

              </div>



              {/* Terms */}

              <div className="mb-3">

                <input 
                  type="checkbox"
                  className="me-2"
                />

                I agree to the Terms & Conditions

              </div>



              <button className="btn btn-success w-100">

                Register

              </button>



              <p className="text-center mt-3">

                Already have an account?

                <a href="/login">
                  Login
                </a>

              </p>


            </div>

          </div>

        </div>

      </div>

    </div>

  );

}


export default Register;