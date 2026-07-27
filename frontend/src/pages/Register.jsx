import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaPhone,
  FaShoppingBag,
  FaUser,
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
    <main className="auth-shell app-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card auth-panel glass-card border-0 overflow-hidden">
              <div className="row g-0">
                <div className="col-lg-5 d-none d-lg-flex auth-side p-5 flex-column justify-content-between">
                  <div>
                    <FaShoppingBag size={42} className="mb-4" />
                    <h1 className="h2">Create your ShopEase account</h1>
                    <p className="mt-3 text-white-50">
                      Save favorites, speed through checkout, and track your account activity.
                    </p>
                  </div>

                  <span className="badge bg-light text-primary align-self-start">
                    Fast registration
                  </span>
                </div>

                <div className="col-lg-7">
                  <div className="card-body p-4 p-md-5 slide-up">
                    <div className="text-center mb-4">
                      <div className="icon-circle mx-auto mb-3">
                        <FaUser />
                      </div>

                      <h2 className="mb-1">Create Account</h2>
                      <p className="text-muted">Join ShopEase in a few steps</p>
                    </div>

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

                      <div className="form-check mb-4 text-start">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="terms"
                          required
                        />

                        <label className="form-check-label" htmlFor="terms">
                          I agree to the Terms & Conditions
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-success w-100 ripple"
                      >
                        Register
                      </button>
                    </form>

                    <p className="text-center mt-4">
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
        </div>
      </div>
    </main>
  );
}

export default Register;
