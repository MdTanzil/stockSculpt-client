import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Navbar from "@/components/NavBar";
import { Footer } from "@/components/ui/footer";
import AppSidebar from "@/pages/deshboard/AppSidebar";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const DashBoard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ display: "flex", flex: 1 }}>
        <AppSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <Box sx={{ flex: 1 }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Menu />
          </IconButton>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashBoard;
