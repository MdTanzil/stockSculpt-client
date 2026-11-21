/* eslint-disable react/prop-types */
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const ShopProvider = ({ children }) => {
  const axiosSecure = useAxiosSecure();
  const [shop, setShop] = useState({});
  // True until the shop fetch settles — pages must show a loading state
  // while this is true instead of treating "no shop yet" as "no shop".
  const [shopLoading, setShopLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setShopLoading(false);
      return;
    }
    const fetchShop = async () => {
      try {
        const response = await axiosSecure.get(`/shop/user`);
        setShop(response.data);
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setShopLoading(false);
      }
    };

    fetchShop();
  }, [axiosSecure, user]);

  // Fetch products only when shop._id is available
  const {
    data: products = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", shop?._id], // Include shop._id as dependency
    queryFn: async () => {
      if (!shop?._id) return []; // Prevents running when shop is undefined
      const res = await axiosSecure.get(`/shop/${shop._id}/products`);
      return res.data;
    },
    enabled: !!shop?._id, // Runs query only when shop._id exists
  });

  // Fetch Orders only when shop._id is available
  const {
    data: orders = [],
    refetch: orderRefetch,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery({
    queryKey: ["orders", shop?._id], // Include shop._id as dependency
    queryFn: async () => {
      if (!shop?._id) return []; // Prevents running when shop is undefined
      const res = await axiosSecure.get(`/shop/${shop._id}/orders`);
      return res.data;
    },
    enabled: !!shop?._id, // Runs query only when shop._id exists
  });

  // Fetch suppliers only when shop._id is available (the server scopes
  // the list to the caller's shop)
  const {
    data: suppliers = [],
    refetch: supplierRefetch,
    isLoading: suppliersLoading,
  } = useQuery({
    queryKey: ["suppliers", shop?._id],
    queryFn: async () => {
      if (!shop?._id) return [];
      const res = await axiosSecure.get(`/suppliers`);
      return res.data;
    },
    enabled: !!shop?._id,
  });

  // Fetch purchase orders only when shop._id is available (the server
  // scopes the list to the caller's shop)
  const {
    data: purchaseOrders = [],
    refetch: purchaseOrderRefetch,
    isLoading: purchaseOrdersLoading,
  } = useQuery({
    queryKey: ["purchaseOrders", shop?._id],
    queryFn: async () => {
      if (!shop?._id) return [];
      const res = await axiosSecure.get(`/purchase-orders`);
      return res.data;
    },
    enabled: !!shop?._id,
  });

  const shopAllData = {
    shop,
    setShop,
    shopLoading,
    products,
    refetch,
    isLoading,
    error,
    orders,
    orderRefetch,
    orderLoading,
    orderError,
    suppliers,
    supplierRefetch,
    suppliersLoading,
    purchaseOrders,
    purchaseOrderRefetch,
    purchaseOrdersLoading,
    user,
  };

  return (
    <ShopContext.Provider value={shopAllData}>{children}</ShopContext.Provider>
  );
};

export default ShopProvider;
