/* eslint-disable react/prop-types */
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const ShopProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [shop, setShop] = useState();

  const { user } = useAuth();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await axiosSecure.get(`/shop/user`);
        setShop(response.data);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    if (user) {
      fetchShop(); // Call the async function inside useEffect
    }
  }, [axiosSecure, user]);

  const shopAllData = {
    shop,
    setShop,
  };
  return (
    <ShopContext.Provider value={shopAllData}>{children}</ShopContext.Provider>
  );
};

export default ShopProvider;
