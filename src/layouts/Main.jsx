import Navbar from "@/components/NavBar";
import { Footer } from "@/components/ui/footer";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <Navbar />

      <div className="">
        <Outlet></Outlet>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
