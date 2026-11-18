import { Link, Outlet } from "react-router-dom";

import { Footer } from "@/components/ui/footer";
import NavBar from "../components/NavBar";
import useAuth from "../hooks/useAuth";

const AdminDashBoard = () => {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar></NavBar>
      <div className="flex flex-1 container mx-auto ">
        <div className="w-64 bg-gray-200   justify-center ">
          <div className="bg-slate-300 m-2 flex justify-center ">
            <div className="">
              <div className="avatar">
                <div className="w-24 rounded-xl">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "Admin"} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-2xl font-bold text-white">
                      {user?.displayName?.charAt(0) || "A"}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-lg font-bold text-primary">
                {user?.displayName}
              </p>
            </div>
          </div>
          <Link to={"/admin"}>
            <button className="btn  btn-primary m-2 btn-sm  w-[80%]">
              Home
            </button>
          </Link>
          <Link to={"/admin/manageProduct"}>
            <button className="btn  btn-primary m-2 btn-sm  w-[80%]">
              Manage Shop
            </button>
          </Link>
          <Link to={"/admin/users"}>
            <button className="btn  btn-primary m-2 btn-sm  w-[80%]">
              Manage User
            </button>
          </Link>
        </div>

        <div className="divider divider-horizontal divider-primary m-1 p-1"></div>
        <div className="w-full  mx-auto mt-5 p-1">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashBoard;
