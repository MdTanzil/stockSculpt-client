import { ShopContext } from "@/provider/ShopProvider";
import { useContext } from "react";

const useShop = () => {
  const {
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
  } = useContext(ShopContext);

  return {
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
};

export default useShop;
