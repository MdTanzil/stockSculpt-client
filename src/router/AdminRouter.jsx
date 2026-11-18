/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Like PrivateRouter, but also requires the admin role. The role comes from
// the /auth/login response and is stored in AuthContext by AuthProvider.
// Non-admins are sent to their own dashboard instead of the admin panel.
const AdminRouter = ({ children }) => {
  const { user, loading, role } = useAuth();
  const location = useLocation();
  if (loading) {
    return <progress className="progress w-56"></progress>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
  }
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace></Navigate>;
  }
  return children;
};

export default AdminRouter;
