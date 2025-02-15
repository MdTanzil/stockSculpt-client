import Navbar from "@/components/Navbar";
import { Footer } from "@/components/ui/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/pages/deshboard/AppSidebar";
import { Outlet } from "react-router-dom";
const DashBoard = () => {
  return (
    <div>
      <Navbar />
      <SidebarProvider>
        <div className="bg-red-300">
          <AppSidebar />
        </div>
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
