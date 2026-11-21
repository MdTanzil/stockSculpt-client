import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Pencil, Store } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import formatDate from "../../utils/formatDate";
import {
  addMonths,
  graceEndDate,
  isInGrace,
} from "../../utils/subscriptionDates";

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

  // Plan-change dialog state. A subscription is a plan AND a period,
  // so changing a plan goes through a dialog where the admin picks the
  // plan and the billing period (or an exact end date) instead of the
  // old bare dropdown that set no dates at all.
  const [planDialogShop, setPlanDialogShop] = useState(null);
  const [dialogPlan, setDialogPlan] = useState("");
  const [dialogPeriod, setDialogPeriod] = useState("monthly");
  const [dialogEndDate, setDialogEndDate] = useState("");
  const [savingPlan, setSavingPlan] = useState(false);

  const openPlanDialog = (shop) => {
    setPlanDialogShop(shop);
    setDialogPlan(currentPlanName(shop));
    setDialogPeriod("monthly");
    setDialogEndDate("");
  };

  const closePlanDialog = () => {
    setPlanDialogShop(null);
    setSavingPlan(false);
  };

  const dialogPlanDoc = plans.find((plan) => plan.name === dialogPlan);
  const dialogPlanIsFree = (dialogPlanDoc?.price ?? 0) === 0;

  // The end date the save would store, previewed live in the dialog.
  const dialogPreviewEnd = () => {
    if (dialogPlanIsFree) return null;
    if (dialogPeriod === "custom") {
      const date = new Date(dialogEndDate);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    return addMonths(new Date(), dialogPeriod === "yearly" ? 12 : 1);
  };

  const handleSavePlan = async () => {
    if (!planDialogShop) return;
    const body = { plan: dialogPlan };
    if (!dialogPlanIsFree) {
      if (dialogPeriod === "custom") {
        const endDate = new Date(dialogEndDate);
        if (Number.isNaN(endDate.getTime()) || endDate <= new Date()) {
          toast.error("Pick an end date in the future.");
          return;
        }
        body.endDate = dialogEndDate;
      } else {
        body.interval = dialogPeriod;
      }
    }
    setSavingPlan(true);
    try {
      await axiosSecure.put(`/shop/${planDialogShop._id}/plan`, body);
      toast.success("Subscription plan updated.");
      closePlanDialog();
      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Could not update the plan."
      );
      setSavingPlan(false);
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {currentPlanName(shop)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {shop?.subscriptionEndDate
                              ? isInGrace(shop)
                                ? `Expired ${formatDate(shop.subscriptionEndDate)} — grace until ${formatDate(graceEndDate(shop.subscriptionEndDate))}`
                                : `until ${formatDate(shop.subscriptionEndDate)}`
                              : shop?.subscriptionPlan === "premium"
                                ? "No end date set"
                                : "No expiry"}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => openPlanDialog(shop)}
                          aria-label={`Change subscription plan for ${shop?.name}`}
                        >
                          <Pencil size={16} />
                        </IconButton>
                      </Box>
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

      {/* Change a shop's plan: pick the plan, then the period it runs
      for. The Free plan never expires; a paid plan runs Monthly or
      Yearly from today, or until an exact end date. */}
      <Dialog
        open={Boolean(planDialogShop)}
        onClose={closePlanDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Change plan{planDialogShop ? ` — ${planDialogShop.name}` : ""}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <Select
            size="small"
            fullWidth
            value={dialogPlan}
            onChange={(event) => setDialogPlan(event.target.value)}
            aria-label="Subscription plan"
          >
            {plans.map((plan) => (
              <MenuItem key={plan._id || plan.name} value={plan.name}>
                {plan.name} (${plan.price}/mo)
              </MenuItem>
            ))}
            {/* A shop on a plan that no longer exists (renamed or
            deleted) still shows its current plan instead of a blank
            select. */}
            {planDialogShop &&
              !plans.some(
                (plan) => plan.name === currentPlanName(planDialogShop)
              ) && (
                <MenuItem
                  value={currentPlanName(planDialogShop)}
                  disabled
                >
                  {currentPlanName(planDialogShop)}
                </MenuItem>
              )}
          </Select>
          {!dialogPlanIsFree && (
            <>
              <ToggleButtonGroup
                value={dialogPeriod}
                exclusive
                fullWidth
                size="small"
                onChange={(_, value) => value && setDialogPeriod(value)}
                aria-label="Billing period"
              >
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="yearly">Yearly</ToggleButton>
                <ToggleButton value="custom">Custom end date</ToggleButton>
              </ToggleButtonGroup>
              {dialogPeriod === "custom" && (
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  label="End date"
                  value={dialogEndDate}
                  onChange={(event) => setDialogEndDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              )}
              <Typography variant="body2" color="text.secondary">
                {dialogPreviewEnd()
                  ? `Active from ${formatDate(new Date())} until ${formatDate(dialogPreviewEnd())}.`
                  : "Pick an end date in the future."}
              </Typography>
            </>
          )}
          {dialogPlanIsFree && (
            <Typography variant="body2" color="text.secondary">
              The Free plan never expires.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closePlanDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSavePlan}
            disabled={
              savingPlan ||
              !dialogPlan ||
              (!dialogPlanIsFree && !dialogPreviewEnd())
            }
          >
            {savingPlan ? "Saving…" : "Save plan"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MenageShop;
