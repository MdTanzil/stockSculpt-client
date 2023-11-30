import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });
  console.log(userData);
  const sendPromotional = async (email) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });
    if (text) {
        axiosSecure.post(`/send-email`,{to : email,"subject": "promotional",text: text})
        .then(res =>{
            if (res.data.success) {
                Swal.fire('Email send successFully');
            }
        })
      
    }
  };
  return (
    <div>
      <h2 className="text-center text-4xl text-primary">Manage Your user ()</h2>
      <div className="overflow-x-auto ">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>User name</th>
              <th>Shop Name</th>
              <th>Logo</th>
              <th>roll</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="">
            {/* row 1 */}
            {userData?.map((user, idx) => (
              <tr key={user?._id} className="text-center text-lg ">
                <td>{idx + 1}</td>
                <th className="font-semibold">{user?.name}</th>
                <td>{user?.shopName}</td>

                <td>
                  <div className="flex items-center justify-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={user?.shopLogo} />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user?.roll}</td>

                <td className="flex gap-1 justify-center items-center ">
                  {user?.roll || (
                    <button
                      className="btn btn-xs bg-primary hover:bg-primary border-none text-white"
                      onClick={() => sendPromotional(user?.email)}
                    >
                      Send promotional email
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
