import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useAuth from "@/hooks/useAuth";
import useShop from "@/hooks/useShop";
import { Menu } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";

// Active nav links keep the teal #00796b highlight (NavLink adds the
// "active" class automatically, which the sx selector below targets).
const navLinkSx = {
  color: "white",
  textTransform: "none",
  fontSize: "1rem",
  "&:hover": { color: "#00796b" },
  "&.active": { color: "#00796b" },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logOut, user } = useAuth();
  const { shop } = useShop();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully Logout  !");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#2c3e50", px: 3, py: 0.5 }}>
      <Toolbar
        disableGutters
        sx={{ width: "100%", maxWidth: "1280px", mx: "auto" }}
      >
        {/* Logo */}
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "white",
            textDecoration: "none",
          }}
        >
          Shop<span style={{ color: "#3b82f6" }}>Inventory</span>
        </Typography>

        {/* Desktop Menu */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Button component={NavLink} to="/" sx={navLinkSx}>
            Home
          </Button>
          <Button component={NavLink} to="/about" sx={navLinkSx}>
            About
          </Button>
          <Button component={NavLink} to="/services" sx={navLinkSx}>
            Services
          </Button>
          {user && shop && (
            <Button component={NavLink} to="/dashboard" sx={navLinkSx}>
              My Shop
            </Button>
          )}
          {user && !shop && (
            <Button component={NavLink} to="/create-store-account" sx={navLinkSx}>
              Create Store
            </Button>
          )}
        </Box>

        {/* Login Button (visible on large screens) */}
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          {user?.email ? (
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": { backgroundColor: "#00796b", borderColor: "#00796b" },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.5)",
                "&:hover": { backgroundColor: "#00796b", borderColor: "#00796b" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: "block", lg: "none" }, ml: "auto" }}>
          <IconButton
            color="inherit"
            aria-label="Open menu"
            onClick={() => setIsOpen(true)}
            sx={{ border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: 1 }}
          >
            <Menu />
          </IconButton>
          <Drawer
            anchor="left"
            open={isOpen}
            onClose={() => setIsOpen(false)}
            PaperProps={{ sx: { backgroundColor: "#2c3e50", color: "white", width: 280 } }}
          >
            <List sx={{ mt: 3, px: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <ListItem disablePadding>
                <ListItemButton
                  component={NavLink}
                  to="/"
                  onClick={() => setIsOpen(false)}
                  sx={navLinkSx}
                >
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={NavLink}
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  sx={navLinkSx}
                >
                  <ListItemText primary="About" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={NavLink}
                  to="/services"
                  onClick={() => setIsOpen(false)}
                  sx={navLinkSx}
                >
                  <ListItemText primary="Services" />
                </ListItemButton>
              </ListItem>
              {user && shop && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/dashboard/products"
                    onClick={() => setIsOpen(false)}
                    sx={navLinkSx}
                  >
                    <ListItemText primary="Products" />
                  </ListItemButton>
                </ListItem>
              )}
              {user && shop && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/dashboard/orders"
                    onClick={() => setIsOpen(false)}
                    sx={navLinkSx}
                  >
                    <ListItemText primary="Orders" />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding sx={{ mt: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setIsOpen(false);
                    user?.email ? handleLogout() : navigate("/login");
                  }}
                  sx={{
                    color: "white",
                    backgroundColor: user?.email ? "#dc2626" : "#00796b",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    "&:hover": {
                      backgroundColor: user?.email ? "#b91c1c" : "#00695c",
                    },
                  }}
                >
                  {user?.email ? "Log Out" : "Log In"}
                </Button>
              </ListItem>
            </List>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
