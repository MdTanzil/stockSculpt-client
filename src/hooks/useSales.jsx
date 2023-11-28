import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const useSales = () => {
    const {user} = useAuth()
    const axiosSecure = useAxiosSecure()
    const {data} = useQuery({queryKey: ['sales'],queryFn: async()=>{
        const res = await  axiosSecure.get(`/sales/${user.email}`)
        return res.data
    }})
    return [data]
};

export default useSales;