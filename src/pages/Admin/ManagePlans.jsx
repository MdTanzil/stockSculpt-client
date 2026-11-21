import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  yearlyPrice: "",
  productLimit: "",
  features: "",
  popular: false,
  active: true,
  order: 0,
};

const ManagePlans = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // After any plan change, the public plan lists must update too — the
  // subscription page (["plans"]) and the home page (["plans-public"])
  // read the same plans from their own caches.
  const refreshPlanLists = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["plans"] });
    queryClient.invalidateQueries({ queryKey: ["plans-public"] });
  };

  const {
    data: plans = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-plans"],
    queryFn: async () => {
      const res = await axiosSecure.get("/plans/all");
      return res.data;
    },
  });

  const openAdd = () => {
    setEditingPlan(null);
    setForm({ ...emptyForm, order: plans.length });
    setDialogOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description || "",
      price: String(plan.price),
      yearlyPrice:
        plan.yearlyPrice !== undefined && plan.yearlyPrice !== null
          ? String(plan.yearlyPrice)
          : "",
      productLimit: String(plan.productLimit),
      features: (plan.features || []).join("\n"),
      popular: plan.popular,
      active: plan.active,
      order: plan.order ?? 0,
    });
    setDialogOpen(true);
  };

  const setField = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      yearlyPrice: form.yearlyPrice === "" ? undefined : Number(form.yearlyPrice),
      productLimit: Number(form.productLimit),
      features: form.features
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      popular: form.popular,
      active: form.active,
      order: Number(form.order) || 0,
    };
    setSaving(true);
    try {
      if (editingPlan) {
        await axiosSecure.put(`/plans/${editingPlan._id}`, payload);
        toast.success("Plan updated.");
      } else {
        await axiosSecure.post("/plans", payload);
        toast.success("Plan created.");
      }
      setDialogOpen(false);
      refreshPlanLists();
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't save the plan.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (plan) => {
    try {
      await axiosSecure.put(`/plans/${plan._id}`, {
        ...plan,
        active: !plan.active,
      });
      toast.success(
        plan.active ? "Plan hidden from customers." : "Plan is live again."
      );
      refreshPlanLists();
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't update the plan.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosSecure.delete(`/plans/${deleteTarget._id}`);
      toast.success("Plan deleted.");
      setDeleteTarget(null);
      refreshPlanLists();
    } catch (err) {
      toast.error(err.response?.data?.error || "Couldn't delete the plan.");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Manage Plans
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plans on the subscription page, the home page and in checkout all
            come from here — a change takes effect everywhere at once.
          </Typography>
        </Box>
        <Button variant="contained" onClick={openAdd}>
          Add Plan
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan</TableCell>
              <TableCell align="right">Monthly</TableCell>
              <TableCell align="right">Yearly</TableCell>
              <TableCell align="right">Product limit</TableCell>
              <TableCell>Popular</TableCell>
              <TableCell>Active</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>Loading plans…</TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  No plans yet. Add one to start selling subscriptions.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>
                    <Typography fontWeight="600">{plan.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">${plan.price}</TableCell>
                  <TableCell align="right">
                    {plan.yearlyPrice !== undefined &&
                    plan.yearlyPrice !== null
                      ? `$${plan.yearlyPrice}`
                      : "—"}
                  </TableCell>
                  <TableCell align="right">{plan.productLimit}</TableCell>
                  <TableCell>
                    {plan.popular && (
                      <Chip label="Most popular" size="small" color="primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.active}
                      onChange={() => handleToggleActive(plan)}
                      aria-label={`Show ${plan.name} to customers`}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openEdit(plan)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(plan)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / edit dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPlan ? `Edit ${editingPlan.name}` : "Add a plan"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={setField("name")}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={setField("description")}
            fullWidth
            multiline
            rows={2}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Monthly price ($)"
              type="number"
              value={form.price}
              onChange={setField("price")}
              fullWidth
              required
              inputProps={{ min: 0, step: "0.01" }}
            />
            <TextField
              label="Yearly price ($) — optional"
              type="number"
              value={form.yearlyPrice}
              onChange={setField("yearlyPrice")}
              fullWidth
              helperText="Leave empty for monthly only. 10x monthly = 2 months free."
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Product limit"
              type="number"
              value={form.productLimit}
              onChange={setField("productLimit")}
              fullWidth
              required
              inputProps={{ min: 0, step: 1 }}
            />
            <TextField
              label="Display order"
              type="number"
              value={form.order}
              onChange={setField("order")}
              fullWidth
              helperText="Lower shows first."
              inputProps={{ step: 1 }}
            />
          </Box>
          <TextField
            label="Features — one per line"
            value={form.features}
            onChange={setField("features")}
            fullWidth
            multiline
            rows={5}
            placeholder={"Up to 200 products\nInventory & stock tracking\nPoint of sale (POS)"}
          />
          <Box sx={{ display: "flex", gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.popular}
                  onChange={setField("popular")}
                />
              }
              label="Most popular"
            />
            <FormControlLabel
              control={
                <Switch checked={form.active} onChange={setField("active")} />
              }
              label="Active (shown to customers)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || !form.name.trim() || form.price === "" || form.productLimit === ""}
          >
            {saving ? "Saving…" : editingPlan ? "Save changes" : "Create plan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The plan will stop appearing on the subscription page and in
            checkout. Existing subscriptions and payments are not affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagePlans;
