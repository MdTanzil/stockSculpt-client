/* eslint-disable react/prop-types */
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const ShopProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [shop, setShop] = useState({});
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
      fetchShop();
    }
  }, [axiosSecure, user]);

  // Fetch products only when shop._id is available
  const {
    data: products = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", shop._id], // Include shop._id as dependency
    queryFn: async () => {
      if (!shop._id) return []; // Prevents running when shop is undefined
      const res = await axiosSecure.get(`/shop/${shop._id}/products`);
      return res.data;
    },
    enabled: !!shop._id, // Runs query only when shop._id exists
  });

  // Fetch Orders only when shop._id is available
  const {
    data: orders = [],
    refetch: orderRefetch,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["orders", shop._id], // Include shop._id as dependency
    queryFn: async () => {
      if (!shop._id) return []; // Prevents running when shop is undefined
      const res = await axiosSecure.get(`/shop/${shop._id}/orders`);
      return res.data;
    },
    enabled: !!shop._id, // Runs query only when shop._id exists
  });

  const shopAllData = {
    shop,
    setShop,
    products,
    refetch,
    isLoading,
    error,
    orders,
    orderRefetch,
    orderLoading,
    orderError,
    user,
  };

  return (
    <ShopContext.Provider value={shopAllData}>{children}</ShopContext.Provider>
  );
};

export default ShopProvider;
