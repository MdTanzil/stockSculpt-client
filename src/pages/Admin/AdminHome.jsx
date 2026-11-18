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
      <p className="text-center text-lg text-muted-foreground">
        Loading admin stats...
      </p>
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
      <h2 className="mb-5 text-center text-4xl text-primary">Admin Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.title} className="stat rounded-lg border bg-base-100 shadow">
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
