import { Link, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import useShop from "../hooks/useShop";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const DashBoard = () => {
  const [limitData, setlimitData] = useState();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  console.log(user?.email);

  console.log(limitData);

  // useEffect(() => {
  //   axiosSecure.get(`/shops/${user?.email}`)
  //   .then((response) => {
  //     setlimitData(response.data);
  //   })

  // }, []);
  // const { data: shopInfo ,isLoading:isl} = useQuery({
  //   queryKey: ["shop-info"],
  //   queryFn: async () => {
  //     const result = await axiosSecure.get(`/shops/${user?.email}`);
  //     // console.log(result);
  //     return result.data;
  //   },
  // });
  // if (isl) {
  //   // TODO
  //   return (
  //     <>
  //       <p>spin</p>
  //     </>
  //   );
  // }
  // console.log(shopInfo);

  const { data: userInfo, isLoading } = useShop();
  if (isLoading) {
    // TODO
    return (
      <>
        <p>spin</p>
      </>
    );
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className="flex   container mx-auto ">
        <div className="w-64  min-h-screen bg-gray-200   justify-center ">
          <div className="bg-slate-300 m-2 flex justify-center ">
            <div className="">
              <div className="avatar">
                <div className="w-24 rounded-xl">
                  <img src={userInfo?.shopLogo} />
                </div>
              </div>
              <p className="text-lg font-bold text-primary">
                {userInfo?.shopName}
              </p>
            </div>
          </div>
          <Link to={"/dashboard"}>
            <button className="btn btn-sm  btn-primary m-2  w-[80%]">
              Home
            </button>
          </Link>
          <Link to={"/dashboard/manage-product"}>
            <button className="btn  btn-primary m-2 btn-sm  w-[80%]">
              Manage Product
            </button>
          </Link>

          <Link to={"/dashboard/add-product"}>
            <button className="btn  btn-primary m-2 btn-sm  w-[80%]">
              Add Product
            </button>
          </Link>

          <Link to={"/dashboard/checkout"}>
            <button className="btn  btn-primary m-2 btn-sm  w-[80%]">
              checkout
            </button>
          </Link>
        </div>

        <div className="divider divider-horizontal divider-primary m-1 p-1"></div>
        <div className="w-full  mx-auto mt-5 p-1">
          <Outlet />
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DashBoard;
