import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
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
              Simplify Your Inventory Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-5xl text-center "
            >
              Discover the power of our cutting-edge Inventory Management System
              — a comprehensive solution designed to streamline your business
              processes. From tracking stock levels and optimizing order
              fulfillment to real-time analytics, our platform empowers you to
              take control of your inventory with ease.
            </motion.p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Jump on a call <PhoneCall className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              className="gap-4"
              onClick={() => navigate("/register")}
            >
              Sign up here <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero1 };
