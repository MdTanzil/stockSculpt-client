import Navbar from "@/components/Navbar";
import { Footer } from "@/components/ui/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/pages/deshboard/AppSidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useShop from "../hooks/useShop";
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
