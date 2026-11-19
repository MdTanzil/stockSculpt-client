import Box from "@mui/material/Box";
import Navbar from "@/components/NavBar";
import { Footer } from "@/components/ui/footer";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Main;
