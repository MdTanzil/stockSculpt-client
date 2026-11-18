import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MenageShop = () => {
  const axiosSecure = useAxiosSecure();
  const { data: shops, isLoading } = useQuery({
    queryKey: ["all-shops"],
    queryFn: async () => {
      const res = await axiosSecure.get("/shop");
      return res.data;
    },
  });

  const sendNotice = async (email) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Notice",
      inputPlaceholder: "Type your notice here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });
    if (text) {
      try {
        const res = await axiosSecure.post(`/send-email`, {
          to: email,
          subject: "Notice from StockSculpt",
          text: text,
        });
        if (res.data.success) {
          Swal.fire("Email sent successfully");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Could not send email",
          text: "The email service is not available right now. Please try again later.",
        });
      }
    }
  };

  return (
    <div>
      <h2 className="text-center text-4xl text-primary">
        Manage Shops ({shops?.length || 0})
      </h2>
      <div className="mt-5">
        {isLoading ? (
          <p className="text-center text-lg text-muted-foreground">
            Loading shops...
          </p>
        ) : !shops?.length ? (
          <p className="py-12 text-center text-lg text-muted-foreground">
            No shops found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>Logo</th>
                  <th>Shop Name</th>
                  <th>Owner</th>
                  <th>Plan</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop, idx) => (
                  <tr key={shop?._id} className="text-center text-lg">
                    <td>{idx + 1}</td>
                    <td>
                      <div className="flex items-center justify-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            {shop?.logo ? (
                              <img src={shop.logo} alt={shop?.name} />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-primary text-xl font-bold text-white">
                                {shop?.name?.charAt(0) || "S"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{shop?.name}</td>
                    <td>{shop?.owner?.name || shop?.owner?.email || "—"}</td>
                    <td className="capitalize">
                      {shop?.subscriptionPlan || "free"}
                    </td>
                    <td>
                      <button
                        className="btn btn-xs border-none bg-primary text-white hover:bg-primary"
                        onClick={() => sendNotice(shop.owner?.email)}
                        disabled={!shop.owner?.email}
                      >
                        Send Notice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenageShop;
