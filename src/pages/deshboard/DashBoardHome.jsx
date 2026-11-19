import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import useShop from "@/hooks/useShop";
import OrderStatusBadge from "@/components/order-status-badge";
import {
  AlertTriangle,
  Box as BoxIcon,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useMemo } from "react";
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

  // Monthly revenue from completed orders for the last 6 months
  // (months with no completed orders show 0). Same "completed only"
  // definition as the Revenue stat card above.
  const monthlyRevenue = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleString("en-US", { month: "short" }),
        revenue: 0,
      });
    }
    const byKey = new Map(months.map((m) => [m.key, m]));
    orders
      .filter((order) => order.orderStatus === "completed")
      .forEach((order) => {
        const d = new Date(order.createdAt);
        if (Number.isNaN(d.getTime())) return;
        const month = byKey.get(`${d.getFullYear()}-${d.getMonth()}`);
        if (month) month.revenue += Number(order.totalPrice) || 0;
      });
    return months;
  }, [orders]);

  const hasRevenue = monthlyRevenue.some((m) => m.revenue > 0);

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

      {lowStockProducts.length > 0 && (
        <Alert
          severity="warning"
          action={
            <Button
              component={RouterLink}
              to="/dashboard/products"
              color="inherit"
              size="small"
            >
              View products
            </Button>
          }
        >
          <AlertTitle>Low stock warning</AlertTitle>
          {lowStockProducts.map((product) => (
            <Typography key={product._id} variant="body2">
              {product.name} — {product.stock} left
            </Typography>
          ))}
        </Alert>
      )}

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

      <Card>
        <CardContent>
          <Typography variant="h6">Revenue — Last 6 Months</Typography>
          <Typography variant="body2" color="text.secondary">
            Completed orders only.
          </Typography>
          {hasRevenue ? (
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: monthlyRevenue.map((m) => m.label),
                  // Default x-axis height is 25px, leaving a 16px label
                  // budget (25 - 6 tick - 3 gap) — too small for Poppins at
                  // 12px, so the chart drops every label. Height 40 gives a
                  // 31px budget. tickLabelInterval forces all 6 labels to
                  // show (no overlap risk with short month names).
                  height: 40,
                  tickLabelInterval: () => true,
                },
              ]}
              series={[
                {
                  data: monthlyRevenue.map((m) => m.revenue),
                  valueFormatter: (value) => `$${value.toFixed(2)}`,
                },
              ]}
              height={280}
              margin={{ left: 60, bottom: 40 }}
            />
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ py: 6, textAlign: "center" }}
            >
              No completed orders yet — revenue will appear here once orders
              are completed.
            </Typography>
          )}
        </CardContent>
      </Card>

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
                  <OrderStatusBadge status={order.orderStatus} />
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
