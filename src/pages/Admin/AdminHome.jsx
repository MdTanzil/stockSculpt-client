import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AdminHome = () => {
    const axiosSecure = useAxiosSecure()
    const {data:adminData}= useQuery({queryKey: ['adminState'], queryFn: async()=>{
        const res = await axiosSecure.get('/admin/state')
        return res.data
    }})

  return (
    <div>
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Total Income</div>
          <div className="stat-value">{adminData?.total}$</div>
          {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Total Product</div>
          <div className="stat-value">{adminData?.totalProduct}</div>
          {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Total Sales</div>
          <div className="stat-value">{adminData?.totalSale} $</div>
          {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
