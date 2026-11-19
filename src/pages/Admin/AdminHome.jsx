import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { resetDemoData } from "../../utils/resetDemoData";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [resetLog, setResetLog] = useState([]);

  const handleReset = async () => {
    const ok = window.confirm(
      "This will DELETE all users (except your admin account), shops, products, orders and subscriptions, then create fresh dummy data. Continue?"
    );
    if (!ok) return;
    setResetting(true);
    setResetDone(false);
    setResetLog([]);
    const log = (line) => setResetLog((prev) => [...prev, line]);
    try {
      await resetDemoData(axiosSecure, log);
    } catch (err) {
      log(`ERROR: ${err.message}`);
    }
    setResetting(false);
    setResetDone(true);
  };
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
      {/* TEMPORARY one-off reset tool — remove after the reseed is verified live. */}
      <Card variant="outlined" sx={{ mt: 5, borderColor: "error.main" }}>
        <CardContent>
          <Typography variant="h6" color="error">
            Reset demo data (temporary)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Deletes all users (except your admin account), shops, products,
            orders and subscriptions, then creates fresh dummy data: shop
            &ldquo;Birir Dokan&rdquo;, 8 products, 7 orders.
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleReset}
            disabled={resetting}
          >
            {resetting ? "Resetting…" : "Reset demo data"}
          </Button>
          {resetLog.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                mt: 2,
                p: 2,
                maxHeight: 320,
                overflow: "auto",
                bgcolor: "action.hover",
              }}
            >
              <Typography
                component="pre"
                variant="body2"
                sx={{ m: 0, whiteSpace: "pre-wrap", fontFamily: "monospace" }}
              >
                {resetLog.join("\n")}
              </Typography>
            </Paper>
          )}
          {resetDone && !resetting && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Reset finished — check the log above, then refresh the dashboard
              to see the new data.
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
