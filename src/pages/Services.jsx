import {
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Store,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Store,
      title: "Store Setup",
      text: "Create your own shop with a name, logo and address, and manage everything from a single dashboard.",
    },
    {
      icon: Boxes,
      title: "Inventory Management",
      text: "Add products with images, prices, categories and stock quantities. Update or remove them any time.",
    },
    {
      icon: ClipboardList,
      title: "Order Management",
      text: "Build orders from your stock, set quantities and status, and keep every order organised and searchable.",
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Overview",
      text: "Totals for products, orders and revenue, plus low-stock alerts, all on one simple dashboard home.",
    },
    {
      icon: FileText,
      title: "Invoices & Checkout",
      text: "Download a clean PDF invoice for any order, with item lines and the total amount, ready to share.",
    },
    {
      icon: TrendingUp,
      title: "Growth Plans",
      text: "Start free and upgrade when your shop grows, with higher product limits on paid subscription plans.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary">Our Services</h1>
        <p className="mt-4 text-lg text-gray-600">
          Everything a small shop needs to run its inventory, orders and sales
          in one place.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <service.icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{service.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/subscription"
          className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          View Subscription Plans
        </Link>
      </div>
    </div>
  );
};

export default Services;
