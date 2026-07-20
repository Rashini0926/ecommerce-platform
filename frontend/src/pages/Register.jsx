import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
} from "react-icons/fa";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await registerUser(formData);

      setSuccess(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow border-0">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                Create Account
              </h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Full Name */}

                <div className="input-group mb-3">

                  <span className="input-group-text">
                    <FaUser />
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <input
                    type="checkbox"
                    className="me-2"
                    required
                  />

                  I agree to the Terms & Conditions

                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Register
                </button>

              </form>

              <p className="text-center mt-3">

                Already have an account?

                <Link to="/login">
                  {" "}Login
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;