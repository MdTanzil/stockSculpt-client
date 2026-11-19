import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const { data: adminData, isLoading } = useQuery({
    queryKey: ["adminState"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/state");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    { title: "Total Income", value: `$${(adminData?.totalIncome || 0).toFixed(2)}` },
    { title: "Total Products", value: adminData?.totalProducts ?? 0 },
    { title: "Total Orders", value: adminData?.totalOrders ?? 0 },
    { title: "Completed Sales", value: adminData?.totalSales ?? 0 },
    { title: "Total Shops", value: adminData?.totalShops ?? 0 },
    { title: "Total Users", value: adminData?.totalUsers ?? 0 },
  ];

  return (
    <div>
      <Typography variant="h4" align="center" color="primary" sx={{ mb: 5 }}>
        Admin Overview
      </Typography>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
              <Typography
                variant="h5"
                component="div"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
