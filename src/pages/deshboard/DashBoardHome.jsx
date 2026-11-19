import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import useShop from "@/hooks/useShop";
import {
  AlertTriangle,
  Box as BoxIcon,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

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
        <Typography variant="h6" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Welcome{shop?.name ? `, ${shop.name}` : ""}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Here is a quick overview of your shop.
        </Typography>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {stat.title}
                </Typography>
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <stat.icon className="h-5 w-5" />
                </Box>
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                {stat.value}
              </Typography>
              <Link
                component={RouterLink}
                to={stat.link}
                underline="hover"
                sx={{ fontSize: "0.875rem" }}
              >
                {stat.linkText}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStockProducts.length > 0 && (
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box sx={{ color: "#f59e0b", display: "flex" }}>
                <AlertTriangle className="h-5 w-5" />
              </Box>
              Low Stock Warning
            </Typography>
            <ul className="mt-2 space-y-2">
              {lowStockProducts.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <Typography variant="body1" fontWeight={500}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#d97706" }}>
                    {product.stock} left
                  </Typography>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6">Recent Orders</Typography>
          {recentOrders.length === 0 ? (
            <div className="py-6 text-center">
              <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <BoxIcon className="h-10 w-10" />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                No orders yet. Create your first order to see it here.
              </Typography>
              <Button
                component={RouterLink}
                to="/dashboard/orders"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Create Order
              </Button>
            </div>
          ) : (
            <ul className="mt-2 space-y-2">
              {recentOrders.map((order) => (
                <li
                  key={order._id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0"
                >
                  <Typography variant="body1" fontWeight={500}>
                    {order.products?.length || 0} item
                    {order.products?.length === 1 ? "" : "s"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {order.orderStatus}
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    ${(Number(order.totalPrice) || 0).toFixed(2)}
                  </Typography>
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
