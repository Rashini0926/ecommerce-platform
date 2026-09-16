import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth();
  const location = useLocation();
  const role = String(user?.role || "").toLowerCase();
  const roleHome = {
    customer: "/dashboard",
    seller: "/seller/dashboard",
    admin: "/admin/dashboard",
  };

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.map((allowedRole) => allowedRole.toLowerCase()).includes(role)) {
    return <Navigate to={roleHome[role] || "/"} replace />;
  }

  return children;
}

export default ProtectedRoute;
