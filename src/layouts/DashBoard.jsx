import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const DashBoard = () => {
    return (
        <div >
            <NavBar></NavBar>
            <div className="flex   container mx-auto ">
                <div className="w-64 min-h-screen bg-gray-200 space-y-2 flex justify-center ">
                <button className="btn  btn-primary m-4  w-[80%]">Home</button>

                </div>


                <div className="divider divider-horizontal divider-primary m-1 p-1"></div>
                <div className="w-full bg-red-300">
                    <Outlet />
                </div>
            </div>
            <Footer></Footer>
            
        </div>
    );
};

export default DashBoard;