import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === "seller" ? "/seller/dashboard" : user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return children;
}

export default ProtectedRoute;
