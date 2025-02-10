import { FeatureSteps } from "@/components/feature-section";

const Feature = () => {
  const features = [
    {
      step: "Step 1",
      title: "Set Up Your Shop",
      content:
        "Create your shop and customize it to match your business needs.",
      image:
        "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=2070&auto=format&fit=crop",
    },
    {
      step: "Step 2",
      title: "Add & Manage Products",
      content:
        "Easily add products, categorize them, and track stock levels in real-time.",
      image:
        "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=2070&auto=format&fit=crop",
    },
    {
      step: "Step 3",
      title: "Track Orders & Sales",
      content:
        "Monitor your orders, analyze sales trends, and manage inventory efficiently.",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=2070&auto=format&fit=crop",
    },
  ];
  return (
    <div className="container mx-auto min-h-[80vh] my-auto">
      <FeatureSteps
        features={features}
        title="Manage Inventory in 3  Steps"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
    </div>
  );
};

export default Feature;
