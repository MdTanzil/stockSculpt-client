import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useShopDetails = () => {
    const {user} = useAuth()
    const axiosSequre = useAxiosSecure()
    const {data} = useQuery({queryKey:['shopDetails'],queryFn: async()=>{
        const res = await axiosSequre.get(`/shops/${user.email}`)
        return res.data
    }});
    return [data]
};

export default useShopDetails;