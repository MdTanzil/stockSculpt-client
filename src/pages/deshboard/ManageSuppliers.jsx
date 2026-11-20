import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import { Pencil, Plus, Trash, Truck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const headerCellSx = {
  textTransform: "uppercase",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
};

const zebraRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
};

const emptyForm = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

const ManageSuppliers = () => {
  const axiosSecure = useAxiosSecure();
  const { suppliers, supplierRefetch, suppliersLoading } = useShop();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editSupplier, setEditSupplier] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  // Supplier waiting on delete confirmation (a MUI dialog, not
  // window.confirm — the confirm dialog must be clickable everywhere).
  const [deleteTarget, setDeleteTarget] = useState(null);

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleOpenAdd = () => {
    setEditSupplier(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier);
    setForm({
      name: supplier.name || "",
      contactPerson: supplier.contactPerson || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
      notes: supplier.notes || "",
    });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditSupplier(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Supplier name is required.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        contactPerson: form.contactPerson.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
      };
      if (editSupplier) {
        await axiosSecure.put(`/suppliers/${editSupplier._id}`, payload);
        toast.success("Supplier updated successfully.");
      } else {
        await axiosSecure.post(`/suppliers`, payload);
        toast.success("Supplier added successfully.");
      }
      handleCloseDialog();
      supplierRefetch();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to save supplier."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axiosSecure.delete(`/suppliers/${deleteTarget._id}`);
      toast.success("Supplier deleted successfully.");
      supplierRefetch();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to delete supplier."
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        color="primary.main"
      >
        Manage Your Suppliers
      </Typography>

      <Button
        variant="contained"
        onClick={handleOpenAdd}
        endIcon={<Plus className="h-4 w-4" />}
        sx={{ mt: 2 }}
      >
        Add Supplier
      </Button>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editSupplier ? "Edit Supplier" : "Add a New Supplier"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Supplier name"
              fullWidth
              required
              value={form.name}
              onChange={setField("name")}
            />
            <TextField
              label="Contact person"
              fullWidth
              value={form.contactPerson}
              onChange={setField("contactPerson")}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={setField("email")}
            />
            <TextField
              label="Phone"
              fullWidth
              value={form.phone}
              onChange={setField("phone")}
            />
            <TextField
              label="Address"
              fullWidth
              value={form.address}
              onChange={setField("address")}
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={form.notes}
              onChange={setField("notes")}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving || !form.name.trim()}
          >
            {isSaving ? "Saving..." : "Save Supplier"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete supplier?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTarget?.name} will be permanently deleted. A supplier with
            purchase orders cannot be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {suppliersLoading ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading suppliers...
        </Typography>
      ) : !suppliers?.length ? (
        <Paper variant="outlined" sx={{ mt: 2, py: 6, textAlign: "center" }}>
          <Truck
            className="h-10 w-10"
            style={{ color: "var(--mui-palette-text-secondary)" }}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No suppliers yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Add your first supplier to start ordering stock.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Name</TableCell>
                <TableCell sx={headerCellSx}>Contact</TableCell>
                <TableCell sx={headerCellSx}>Email</TableCell>
                <TableCell sx={headerCellSx}>Phone</TableCell>
                <TableCell sx={headerCellSx}>Address</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier._id} sx={zebraRowSx}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {supplier.name}
                  </TableCell>
                  <TableCell>{supplier.contactPerson || "—"}</TableCell>
                  <TableCell>{supplier.email || "—"}</TableCell>
                  <TableCell>{supplier.phone || "—"}</TableCell>
                  <TableCell>{supplier.address || "—"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(supplier)}
                      aria-label={`Edit ${supplier.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(supplier)}
                      aria-label={`Delete ${supplier.name}`}
                    >
                      <Trash className="h-4 w-4" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} sx={{ color: "text.secondary" }}>
                  {suppliers.length} supplier
                  {suppliers.length === 1 ? "" : "s"}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ManageSuppliers;
