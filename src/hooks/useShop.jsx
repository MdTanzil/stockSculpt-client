import { ShopContext } from "@/provider/ShopProvider";
import { useContext } from "react";

const useShop = () => {
  const {
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
  } = useContext(ShopContext);

  // The caller's role in this shop ("owner" / "manager" / "staff" /
  // "viewer"), from GET /api/shop/user. Null until the shop loads — the
  // derived flags fail closed, so action buttons stay hidden until the
  // role is known. The server enforces the same rules; these flags only
  // decide what the UI offers.
  const shopRole = shop?.role || null;
  const isShopOwner = shopRole === "owner";
  const canEdit =
    shopRole === "owner" || shopRole === "manager" || shopRole === "staff";
  const canDelete = shopRole === "owner" || shopRole === "manager";

  return {
    shop,
    setShop,
    shopLoading,
    shopRole,
    isShopOwner,
    canEdit,
    canDelete,
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
