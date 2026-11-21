import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { Mail, Store } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MenageShop = () => {
  const axiosSecure = useAxiosSecure();
  const { data: shops, isLoading, refetch } = useQuery({
    queryKey: ["all-shops"],
    queryFn: async () => {
      const res = await axiosSecure.get("/shop");
      return res.data;
    },
  });

  // The plan options come from the plans collection (the admin manages
  // them), so a new plan appears here without a code change.
  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axiosSecure.get("/plans");
      return res.data;
    },
  });

  // The plan a shop is on. Older shops have no planName stored, so fall
  // back to the free/paid flag for them.
  const currentPlanName = (shop) =>
    shop?.planName ||
    (shop?.subscriptionPlan === "premium" ? "Premium" : "Free");

  // Admin-only: change a shop's subscription plan in place, same inline
  // pattern as the order status select. The select is controlled by the
  // server value, so a failed update leaves the displayed plan unchanged.
  const handlePlanChange = async (shopId, plan) => {
    try {
      await axiosSecure.put(`/shop/${shopId}/plan`, { plan });
      toast.success("Subscription plan updated.");
      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Could not update the plan."
      );
    }
  };

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
      <Typography
        variant="h4"
        align="center"
        color="primary"
        sx={{ fontWeight: "bold" }}
      >
        Manage Shops ({shops?.length || 0})
      </Typography>
      <Box sx={{ mt: 5 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : !shops?.length ? (
          <Paper variant="outlined" sx={{ py: 6, textAlign: "center" }}>
            <Store style={{ margin: "0 auto", width: 40, height: 40, color: "rgba(0, 0, 0, 0.54)" }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No shops found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Shops will appear here once owners create them.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Shop</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shops.map((shop, idx) => (
                  <TableRow key={shop?._id}>
                    <TableCell sx={{ fontVariantNumeric: "tabular-nums" }} color="text.secondary">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={shop?.logo || undefined}
                          alt={shop?.name}
                          variant="rounded"
                          sx={{ width: 36, height: 36 }}
                        >
                          {shop?.name?.charAt(0) || "S"}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {shop?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {shop?.owner?.name || shop?.owner?.email || "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={currentPlanName(shop)}
                        onChange={(event) =>
                          handlePlanChange(shop._id, event.target.value)
                        }
                        aria-label={`Change subscription plan for ${shop?.name}`}
                        sx={{ minWidth: 170 }}
                      >
                        {plans.map((plan) => (
                          <MenuItem key={plan._id || plan.name} value={plan.name}>
                            {plan.name} (${plan.price}/mo)
                          </MenuItem>
                        ))}
                        {/* A shop on a plan that no longer exists (renamed
                        or deleted) still shows its current plan instead
                        of a blank select. */}
                        {!plans.some(
                          (plan) => plan.name === currentPlanName(shop)
                        ) && (
                          <MenuItem value={currentPlanName(shop)} disabled>
                            {currentPlanName(shop)}
                          </MenuItem>
                        )}
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => sendNotice(shop.owner?.email)}
                        disabled={!shop.owner?.email}
                        startIcon={<Mail size={16} />}
                      >
                        Send Notice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </div>
  );
};

export default MenageShop;
