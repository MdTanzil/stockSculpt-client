import { Hero1 } from "@/components/ui/hero-with-text-and-two-button";

const Hero = () => {
  return (
    <div className="container mx-auto  min-h-[80vh]">
      {/* <div className="hero-content flex-col lg:flex-row gap-20">
        <img
          src="https://img.freepik.com/free-vector/checking-boxes-concept-illustration_114360-2465.jpg?w=740&t=st=1701186715~exp=1701187315~hmac=2ab3fdb08c1a0430136daaa6bcf453241d4e854966d367f3138f5f5c2eaa10e2"
          className="max-w-lg rounded-lg shadow-2xl"
        />
        <div className="flex-grow">
          <h1 className="text-5xl font-bold text-primary ">
            Effortless Inventory Management <br /> & Business Operations
          </h1>
          <p className="py-6 ">
            Discover the power of our cutting-edge Inventory Management System —
            a comprehensive solution designed to streamline your business
            processes. From tracking stock levels and optimizing order
            fulfillment to real-time analytics, our platform empowers you to
            take control of your inventory with ease.
          </p>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div> */}

      <Hero1 />
    </div>
  );
};

export default Hero;
