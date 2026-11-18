import Feature from "@/components/homeComponent/Feature";
import Hero from "../components/homeComponent/Hero";
import Plans from "../components/homeComponent/Plans";
import ServicesSection from "../components/homeComponent/ServicesSection";

import { Faq3 } from "@/components/faq3";
import { CTA } from "@/components/ui/call-to-action";

const Home = () => {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <Feature />
      <Plans />
      <Faq3 />
      <CTA />
    </div>
  );
};

export default Home;
