import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
const Hero = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadFull(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    // console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: false,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#00548E",
        },
       
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 3,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 50,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "star",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [],
  );
  return (
    <div className="hero min-h-screen bg-base-200">
      {init &&  <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        className="absolute h-screen -z-10"
        height="75vh"
      />}
      <div className="hero-content flex-col lg:flex-row gap-20">
        <img
          src="https://img.freepik.com/free-vector/checking-boxes-concept-illustration_114360-2465.jpg?w=740&t=st=1701186715~exp=1701187315~hmac=2ab3fdb08c1a0430136daaa6bcf453241d4e854966d367f3138f5f5c2eaa10e2"
          className="max-w-lg rounded-lg shadow-2xl"
        />
        <div className="flex-grow">
          <h1 className="text-5xl font-bold text-primary ">Effortless Inventory Management <br /> &  Business Operations</h1>
          <p className="py-6 ">
          Discover the power of our cutting-edge Inventory Management System — a comprehensive solution designed to streamline your business processes. From tracking stock levels and optimizing order fulfillment to real-time analytics, our platform empowers you to take control of your inventory with ease.
          </p>
          <button className="btn btn-primary">Get Started</button>
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
