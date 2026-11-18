import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

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
      try {
        const res = await axiosSecure.post(`/send-email`, {
          to: email,
          subject: "promotional",
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
      <h2 className="mb-5 text-center text-4xl text-primary">
        Manage Users ({userData?.length || 0})
      </h2>
      {isLoading ? (
        <p className="text-center text-lg text-muted-foreground">
          Loading users...
        </p>
      ) : !userData?.length ? (
        <p className="py-12 text-center text-lg text-muted-foreground">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, idx) => (
                <tr key={user?._id} className="text-center text-lg">
                  <td>{idx + 1}</td>
                  <td>
                    <div className="flex items-center justify-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user?.name} />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary text-xl font-bold text-white">
                              {user?.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <th className="font-semibold">{user?.name}</th>
                  <td>{user?.email}</td>
                  <td className="capitalize">{user?.role || "user"}</td>
                  <td>{user?.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    {user?.role !== "admin" && (
                      <button
                        className="btn btn-xs border-none bg-primary text-white hover:bg-primary"
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
      )}
    </div>
  );
};

export default ManageUsers;
