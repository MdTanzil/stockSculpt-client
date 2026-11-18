import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MoveRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Hero1() {
  const navigate = useNavigate();
  return (
    <div className="w-full ">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20  lg:py-40 items-center justify-center flex-col  ">
          <div className="flex gap-4 flex-col ">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl max-w-5xl tracking-tighter text-center font-semibold text-[#2c3e50]"
            >
              Run Your Shop From One Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-5xl text-center "
            >
              stockSculpt helps small shop owners manage products, stock levels
              and orders in one place. Create your shop, add products, track
              every order — and start free with up to 3 products.
            </motion.p>
          </div>
          <div className="flex flex-row gap-3">
            <Button
              size="lg"
              className="gap-4"
              variant="outline"
              onClick={() => navigate("/services")}
            >
              See our services <Store className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              className="gap-4"
              onClick={() => navigate("/register")}
            >
              Create your shop — it&apos;s free <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero1 };
