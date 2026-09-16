import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaShoppingBag,
  FaStore,
  FaUserCheck,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginUser } from "../services/authService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const roleConfigs = {
  customer: {
    id: "customer",
    label: "Customer",
    badge: "Customer Access",
    title: "Welcome back to ShopEase",
    subtitle: "Sign in to manage your orders, wishlist items, and checkout faster.",
    icon: <FaShoppingBag size={42} className="mb-4 text-white" />,
    authSideClass: "auth-side-customer",
    btnClass: "btn-primary",
    badgeClass: "bg-light text-primary",
    demoEmail: "customer@shopease.com",
    redirectPath: "/dashboard",
  },
  seller: {
    id: "seller",
    label: "Seller Merchant",
    badge: "Seller Merchant Hub",
    title: "Seller Workspace & Store Control",
    subtitle: "Sign in to manage product listings, review pending order queues, and track sales revenue.",
    icon: <FaStore size={42} className="mb-4 text-white" />,
    authSideClass: "auth-side-seller",
    btnClass: "btn-success",
    badgeClass: "bg-light text-success",
    demoEmail: "seller@shopease.com",
    redirectPath: "/seller/dashboard",
  },
  admin: {
    id: "admin",
    label: "Platform Admin",
    badge: "System Administration Console",
    title: "ShopEase Admin Command Center",
    subtitle: "Sign in to inspect platform revenue growth, verify pending sellers, and monitor system security.",
    icon: <FaShieldAlt size={42} className="mb-4 text-white" />,
    authSideClass: "auth-side-admin",
    btnClass: "btn-danger",
    badgeClass: "bg-light text-danger",
    demoEmail: "admin@shopease.com",
    redirectPath: "/admin/dashboard",
  },
};

function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("customer");
  const [email, setEmail] = useState("customer@shopease.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentRoleConfig = roleConfigs[selectedRole];

  const handleRoleSwitch = (roleKey) => {
    setSelectedRole(roleKey);
    const config = roleConfigs[roleKey];
    setEmail(config.demoEmail);
    setPassword("password123");
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(email, password);
      const userData = response.user;
      const authToken = response.token;

      const userWithRole = {
        ...userData,
        role: String(userData?.role || "customer").toLowerCase(),
      };

      if (userWithRole.role !== selectedRole) {
        throw new Error(`This account is registered as a ${userWithRole.role} account. Please select the ${userWithRole.role} portal.`);
      }

      login(userWithRole, authToken);
      showToast(`Logged in successfully as ${currentRoleConfig.label}!`, "success");

      // Dynamic role-based redirection
      const targetPath =
        userWithRole.role === "admin"
          ? "/admin/dashboard"
          : userWithRole.role === "seller"
          ? "/seller/dashboard"
          : "/dashboard";

      navigate(targetPath);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed. Please check credentials.";

      setError(message);
      showToast(message, "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell app-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Role Switcher Pills Bar */}
            <div className="role-pill-bar mb-4 p-2 bg-surface-soft border rounded-4 d-flex justify-content-center gap-2">
              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 py-2 ${
                  selectedRole === "customer"
                    ? "btn-primary shadow-sm"
                    : "btn-outline-secondary border-0"
                }`}
                onClick={() => handleRoleSwitch("customer")}
              >
                <FaShoppingBag className="me-2" /> Customer Portal
              </button>

              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 py-2 ${
                  selectedRole === "seller"
                    ? "btn-success shadow-sm"
                    : "btn-outline-secondary border-0"
                }`}
                onClick={() => handleRoleSwitch("seller")}
              >
                <FaStore className="me-2" /> Seller Hub
              </button>

              <button
                type="button"
                className={`btn btn-sm rounded-pill px-4 py-2 ${
                  selectedRole === "admin"
                    ? "btn-danger shadow-sm"
                    : "btn-outline-secondary border-0"
                }`}
                onClick={() => handleRoleSwitch("admin")}
              >
                <FaShieldAlt className="me-2" /> Admin Console
              </button>
            </div>

            {/* Main Auth Card with Dynamic Role Theme */}
            <div className="card auth-panel glass-card border-0 overflow-hidden shadow-lg">
              <div className="row g-0">
                {/* Dynamic Role-Based Side Panel */}
                <div
                  className={`col-lg-5 d-none d-lg-flex auth-side ${currentRoleConfig.authSideClass} p-5 flex-column justify-content-between`}
                >
                  <div>
                    {currentRoleConfig.icon}
                    <h1 className="h2">{currentRoleConfig.title}</h1>
                    <p className="mt-3 text-white-50">
                      {currentRoleConfig.subtitle}
                    </p>
                  </div>

                  <span className={`badge ${currentRoleConfig.badgeClass} align-self-start py-2 px-3 fw-bold`}>
                    <FaUserCheck className="me-1" />
                    {currentRoleConfig.badge}
                  </span>
                </div>

                {/* Form Section */}
                <div className="col-lg-7">
                  <div className="card-body p-4 p-md-5 slide-up">
                    <div className="text-center mb-4">
                      <div className="icon-circle mx-auto mb-3">
                        {currentRoleConfig.icon}
                      </div>

                      <h2 className="mb-1">{currentRoleConfig.label} Login</h2>
                      <p className="text-muted small">
                        Sign in to access your role-specific dashboard
                      </p>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

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
                        className={`btn ${currentRoleConfig.btnClass} w-100 ripple py-2`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <LoadingSpinner text={`Signing in as ${currentRoleConfig.label}`} />
                        ) : (
                          `Login to ${currentRoleConfig.label} Portal`
                        )}
                      </button>
                    </form>

                    <div className="text-end mt-2">
                      <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                    <div className="mt-4 pt-3 border-top text-center">
                      <small className="text-muted d-block mb-2">Demo Account Quick Fill:</small>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 me-2 mb-1"
                        onClick={() => handleRoleSwitch("customer")}
                      >
                        Demo Customer
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 me-2 mb-1"
                        onClick={() => handleRoleSwitch("seller")}
                      >
                        Demo Seller
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 mb-1"
                        onClick={() => handleRoleSwitch("admin")}
                      >
                        Demo Admin
                      </button>
                    </div>

                    <p className="text-center mt-4 mb-0">
                      Don't have an account?
                      <Link to="/register"> Register</Link>
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
