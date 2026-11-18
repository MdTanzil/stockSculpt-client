// import Cta from "../components/Cta";
import Feature from "@/components/homeComponent/Feature";
import Team from "../components/Team";
import Hero from "../components/homeComponent/Hero";

import { Faq3 } from "@/components/faq3";
import { PricingCard } from "@/components/pricing-card";
import { CTA } from "@/components/ui/call-to-action";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Hero></Hero>
      <Feature />

      <PricingCard
        title="Business Pro Plan"
        description="Scale your shop with advanced inventory tools and automation."
        price={49}
        originalPrice={99}
        features={[
          {
            title: "Inventory Features",
            items: [
              "Unlimited Products & Categories",
              "Low Stock Alerts & Notifications",
              "Bulk Import & Export",
              "Real-time Stock Tracking",
            ],
          },
          {
            title: "Business Perks",
            items: [
              "Multi-Shop Management",
              "Advanced Sales & Expense Reports",
              "Priority Customer Support",
              "Integration with Accounting Tools",
            ],
          },
        ]}
        buttonText="Upgrade Now"
        onButtonClick={() => navigate("/subscription")}
      />

      <Faq3 />
      <Team></Team>
      <CTA />
    </div>
  );
};

export default Home;
