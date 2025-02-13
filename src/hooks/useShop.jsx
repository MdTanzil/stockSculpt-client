import { ShopContext } from "@/provider/ShopProvider";
import { useContext } from "react";

const useShop = () => {
  const { shop, setShop } = useContext(ShopContext);

  return { shop, setShop };
};

export default useShop;
