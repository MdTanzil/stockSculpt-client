import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useShop from "../../hooks/useShop";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DeshboardHome = () => {
    const {user} = useAuth()
    const axiosSecure = useAxiosSecure()
    const { data: products ,refetch} = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
          const res = await axiosSecure.get(`/products/${user.email}`);
          return res.data;
        },
      });
    const {data:userInfo,isLoading} = useShop()
    if (isLoading) {
        // TODO 
        return <><p>spin</p></>
    }
    return (
        <div className="container mx-auto mt-1">
            {/* TODO  */}
            <h3 className="text-2xl text-primary font-bold">Total {products?.length} product added </h3>
        </div>
    );
};

export default DeshboardHome;