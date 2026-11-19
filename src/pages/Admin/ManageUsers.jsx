import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { Mail, Users } from "lucide-react";
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
      <Typography
        variant="h4"
        align="center"
        color="primary"
        sx={{ mb: 5, fontWeight: "bold" }}
      >
        Manage Users ({userData?.length || 0})
      </Typography>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : !userData?.length ? (
        <Paper
          variant="outlined"
          sx={{ py: 6, textAlign: "center" }}
        >
          <Users style={{ margin: "0 auto", width: 40, height: 40, color: "rgba(0, 0, 0, 0.54)" }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            New users will appear here once they sign up.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((user, idx) => (
                <TableRow key={user?._id}>
                  <TableCell sx={{ fontVariantNumeric: "tabular-nums" }} color="text.secondary">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        src={user?.avatar || undefined}
                        alt={user?.name}
                        sx={{ width: 36, height: 36 }}
                      >
                        {user?.name?.charAt(0) || "U"}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user?.name || "—"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    <Chip
                      label={user?.role || "user"}
                      size="small"
                      color={user?.role === "admin" ? "primary" : "default"}
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell>
                    {user?.isActive ? (
                      <Chip label="Active" size="small" color="success" />
                    ) : (
                      <Chip label="Inactive" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {user?.role !== "admin" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => sendPromotional(user?.email)}
                        startIcon={<Mail size={16} />}
                      >
                        Send email
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ManageUsers;
