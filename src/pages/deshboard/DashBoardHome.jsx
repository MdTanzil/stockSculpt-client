import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useShop from "@/hooks/useShop";
import {
  AlertTriangle,
  Box,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";

const LOW_STOCK_LIMIT = 5;

const DashboardHome = () => {
  const {
    shop,
    products = [],
    orders = [],
    isLoading,
    orderLoading,
  } = useShop();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const revenue = orders
    .filter((order) => order.orderStatus === "completed")
    .reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);
  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= LOW_STOCK_LIMIT
  );
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      link: "/dashboard/products",
      linkText: "Manage products",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      link: "/dashboard/orders",
      linkText: "Manage orders",
    },
    {
      title: "Revenue (Completed)",
      value: `$${revenue.toFixed(2)}`,
      icon: DollarSign,
      link: "/dashboard/checkout",
      linkText: "View invoices",
    },
    {
      title: "Low Stock Items",
      value: lowStockProducts.length,
      icon: AlertTriangle,
      link: "/dashboard/products",
      linkText: "Restock products",
    },
  ];

  if (isLoading || orderLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Welcome{shop?.name ? `, ${shop.name}` : ""}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is a quick overview of your shop.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link
                to={stat.link}
                className="text-sm text-primary hover:underline"
              >
                {stat.linkText}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lowStockProducts.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-amber-600">
                    {product.stock} left
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="py-6 text-center">
              <Box className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                No orders yet. Create your first order to see it here.
              </p>
              <Button asChild className="mt-4">
                <Link to="/dashboard/orders">Create Order</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {recentOrders.map((order) => (
                <li
                  key={order._id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-medium">
                    {order.products?.length || 0} item
                    {order.products?.length === 1 ? "" : "s"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {order.orderStatus}
                  </span>
                  <span className="font-semibold">
                    ${(Number(order.totalPrice) || 0).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
