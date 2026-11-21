import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Link, Outlet } from "react-router-dom";

import { Footer } from "@/components/ui/footer";
import NavBar from "../components/NavBar";
import useAuth from "../hooks/useAuth";

const AdminDashBoard = () => {
  const { user } = useAuth();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          width: "100%",
          maxWidth: "1280px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            width: 256,
            flexShrink: 0,
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "action.hover",
              m: 1,
              display: "flex",
              justifyContent: "center",
              alignSelf: "stretch",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 1 }}>
              <Avatar
                src={user?.photoURL || undefined}
                alt={user?.displayName || "Admin"}
                sx={{ width: 96, height: 96, borderRadius: 3, fontSize: "2rem", fontWeight: "bold" }}
              >
                {user?.displayName?.charAt(0) || "A"}
              </Avatar>
              <Typography
                variant="h6"
                component="p"
                color="primary"
                sx={{ fontWeight: "bold", mt: 1 }}
              >
                {user?.displayName}
              </Typography>
            </Box>
          </Box>
          <Button
            component={Link}
            to="/admin"
            variant="contained"
            size="small"
            sx={{ m: 1, width: "80%" }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/admin/manageProduct"
            variant="contained"
            size="small"
            sx={{ m: 1, width: "80%" }}
          >
            Manage Shop
          </Button>
          <Button
            component={Link}
            to="/admin/users"
            variant="contained"
            size="small"
            sx={{ m: 1, width: "80%" }}
          >
            Manage User
          </Button>
          <Button
            component={Link}
            to="/admin/plans"
            variant="contained"
            size="small"
            sx={{ m: 1, width: "80%" }}
          >
            Manage Plans
          </Button>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ m: 0.5, p: 0.5 }} />
        <Box sx={{ width: "100%", mx: "auto", mt: 5, p: 0.5 }}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AdminDashBoard;
