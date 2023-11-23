import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const DashBoard = () => {
    return (
        <div>
            <NavBar></NavBar>
            <div className="flex  gap-4 ">
                <div className="w-64 min-h-screen bg-accent space-y-2 s ">
                <button className="btn  btn-primary m-4 ">Neutral</button>
            

                </div>
                <div className="w-3/4  bg-red-300">
                    <Outlet />
                </div>
            </div>
            <Footer></Footer>
            
        </div>
    );
};

export default DashBoard;