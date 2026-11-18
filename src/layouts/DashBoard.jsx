import Navbar from "@/components/NavBar";
import { Footer } from "@/components/ui/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/pages/deshboard/AppSidebar";
import { Outlet } from "react-router-dom";
const DashBoard = () => {
  return (
    <div>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
      <Footer />
    </div>
  );
};

export default DashBoard;
