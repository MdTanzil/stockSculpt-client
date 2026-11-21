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

  // App shell: the page itself never scrolls — only the content area
  // does. Before this, the whole window scrolled and long pages (like
  // Reports) slid up underneath the sticky navbar, hiding section
  // headings and table rows behind it. minHeight: 0 on the row lets the
  // content box shrink and scroll inside the 100vh shell. The
  // classNames are hooks for the receipt print CSS (index.css).
  return (
    <Box
      className="dashboard-shell"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        <AppSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <Box
          className="dashboard-content"
          sx={{ flex: 1, overflowY: "auto", minWidth: 0 }}
        >
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
