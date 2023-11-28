import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useShop from "../../hooks/useShop";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useShopDetails from "../../hooks/useShopDetails";
import useSales from "../../hooks/useSales";

const DeshboardHome = () => {
  const { user } = useAuth();
  const [shopDetails] = useShopDetails();

  console.log(shopDetails);
  const axiosSecure = useAxiosSecure();
  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${user.email}`);
      return res.data;
    },
  });
  const [salesData] = useSales();

  //   const totalsales = salesData.reduce((init ,acc)=> )
  console.log(salesData);
  const { data: userInfo, isLoading } = useShop();
  if (isLoading) {
    // TODO
    return (
      <>
        <p>spin</p>
      </>
    );
  }
  const totalSellingPrice = salesData?.reduce(
    (acc, product) => acc + product.sellingPrice,
    0
  );
  return (
    <div className="container mx-auto mt-1">
      {/* TODO  */}
      <h3 className="text-2xl text-primary font-bold">
        Total {products?.length} product added your product limit{" "}
        {shopDetails?.limit}{" "}
      </h3>
      <div className="mt-10 flex justify-center">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Total Sales</div>
            <div className="stat-value text-primary">
              {totalSellingPrice?.toFixed(2)} USD
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Product Sales Count</div>
            <div className="stat-value text-secondary">{salesData?.length}</div>
          </div>
        </div>
      </div>
      {/* {
        salesData?.map(data => )
    } */}

    <h2 className="text-center my-5 text-2xl font-bold ">Your Sell History</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>id</th>
              <th>Name</th>
              <th>Selling Price</th>
              {/* <th>Job</th> */}
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {salesData?.map((data,idx) => (
              <tr key={data?._id}>
                <th>{idx + 1}</th>
                <td>{data?._id}</td>
                <td>{data?.name}</td>
                <td>{data?.sellingPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div></div>
    </div>
  );
};

export default DeshboardHome;
