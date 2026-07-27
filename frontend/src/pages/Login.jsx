import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaShoppingBag, FaUser } from "react-icons/fa";
import { loginUser } from "../services/authService";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await loginUser(email, password);

      login(response.user, response.token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed."
      );
    }
  };

  return (
    <main className="auth-shell app-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card auth-panel glass-card border-0 overflow-hidden">
              <div className="row g-0">
                <div className="col-lg-5 d-none d-lg-flex auth-side p-5 flex-column justify-content-between">
                  <div>
                    <FaShoppingBag size={42} className="mb-4" />
                    <h1 className="h2">Welcome back to ShopEase</h1>
                    <p className="mt-3 text-white-50">
                      Sign in to manage orders, wishlist items, and checkout faster.
                    </p>
                  </div>

                  <span className="badge bg-light text-primary align-self-start">
                    Secure customer access
                  </span>
                </div>

                <div className="col-lg-7">
                  <div className="card-body p-4 p-md-5 slide-up">
                    <div className="text-center mb-4">
                      <div className="icon-circle mx-auto mb-3">
                        <FaUser />
                      </div>

                      <h2 className="mb-1">Login</h2>
                      <p className="text-muted">Access your shopping dashboard</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleLogin}>
                      <div className="input-group mb-3">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>

                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 ripple"
                      >
                        Login
                      </button>
                    </form>

                    <p className="text-center mt-4">
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
        </div>
      </div>
    </main>
  );
}

export default Login;
