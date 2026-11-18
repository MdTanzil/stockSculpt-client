import Navbar from "@/components/NavBar";
import { Footer } from "@/components/ui/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/pages/deshboard/AppSidebar";
import { Outlet } from "react-router-dom";
const DashBoard = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <SidebarProvider className="min-h-0 flex-1">
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
