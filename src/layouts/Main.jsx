import Navbar from "@/components/NavBar";
import { Footer } from "@/components/ui/footer";
import { Outlet } from "react-router-dom";
const Main = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <Outlet></Outlet>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
