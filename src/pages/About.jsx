import { BarChart3, Box, ShieldCheck, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const highlights = [
    {
      icon: Box,
      title: "Product Management",
      text: "Add, edit and organise every product in your shop with live stock levels, categories and pricing in one place.",
    },
    {
      icon: ShoppingCart,
      title: "Order Tracking",
      text: "Create orders from your own stock, follow them from pending to completed, and keep a clear record of every sale.",
    },
    {
      icon: BarChart3,
      title: "Shop Insights",
      text: "See total products, orders and revenue at a glance, with low-stock warnings so you never run out unnoticed.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      text: "Every shop belongs to its owner. Your products, orders and shop data are only visible to you and your admins.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary">About StockSculpt</h1>
        <p className="mt-4 text-lg text-gray-600">
          StockSculpt is a simple inventory management system for small shops.
          It helps shop owners keep track of products, stock levels and orders
          without spreadsheets or paperwork.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <item.icon className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-lg bg-primary p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to organise your shop?</h2>
        <p className="mt-2 text-white/80">
          Create your store account and start managing products and orders in
          minutes.
        </p>
        <Link
          to="/create-store-account"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-primary transition hover:bg-gray-100"
        >
          Create Your Store
        </Link>
      </div>
    </div>
  );
};

export default About;
