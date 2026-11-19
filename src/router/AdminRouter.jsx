/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Like PrivateRouter, but also requires the admin role. The role comes from
// the /auth/login response and is stored in AuthContext by AuthProvider.
// Non-admins are sent to their own dashboard instead of the admin panel.
const AdminRouter = ({ children }) => {
  const { user, loading, role } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
