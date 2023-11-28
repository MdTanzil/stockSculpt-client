
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


const useShop = () => {
    const {user} = useAuth()
    const axiosPublic = useAxiosPublic()
   
    
    try {
        const url = `/shop/${user?.email || ''}`;
        const {data,isLoading,refetch}= useQuery({queryKey:['user-shop', user?.email] ,queryFn: async()=>{
        const response = await axiosPublic.get(url);
            return response.data
        
        } })

        // console.log(data);
        // Extract the data you need from the response
        
        return {data,isLoading,refetch};

    
    } catch (error) {
        console.error("Error fetching shop data:", error);
        throw error; // Propagate the error for the caller to handle
    }
    
};

export default useShop;