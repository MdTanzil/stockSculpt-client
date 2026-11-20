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
    suppliers,
    supplierRefetch,
    suppliersLoading,
    purchaseOrders,
    purchaseOrderRefetch,
    purchaseOrdersLoading,
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
    suppliers,
    supplierRefetch,
    suppliersLoading,
    purchaseOrders,
    purchaseOrderRefetch,
    purchaseOrdersLoading,
    user,
  };
};

export default useShop;
