import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
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
import formatDate from "@/utils/formatDate";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import { ClipboardList, Pencil, Plus, Trash } from "lucide-react";
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

const shortId = (id) => (id ? `#${String(id).slice(-6).toUpperCase()}` : "—");

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const STATUS_CHIP_COLOR = {
  draft: "default",
  ordered: "info",
  received: "success",
  canceled: "error",
};

const ManagePurchaseOrders = () => {
  const axiosSecure = useAxiosSecure();
  const {
    products,
    refetch: refetchProducts,
    suppliers,
    purchaseOrders,
    purchaseOrderRefetch,
    purchaseOrdersLoading,
    canEdit,
    canDelete,
  } = useShop();

  const [open, setOpen] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [createStatus, setCreateStatus] = useState("draft");
  const [isSaving, setIsSaving] = useState(false);
  // Pending confirm dialog: { action: "receive" | "cancel" | "delete", order }
  // (a MUI dialog, not window.confirm — it must be clickable everywhere).
  const [confirm, setConfirm] = useState(null);

  const dialogTotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0),
    0
  );

  const itemsValid =
    items.length > 0 &&
    items.every(
      (item) =>
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) >= 1 &&
        Number.isFinite(Number(item.unitCost)) &&
        Number(item.unitCost) >= 0
    );

  const canSave = supplierId !== "" && itemsValid && !isSaving;

  const resetForm = () => {
    setEditOrder(null);
    setSupplierId("");
    setItems([]);
    setSearchTerm("");
    setNotes("");
    setCreateStatus("draft");
  };

  const handleOpenAdd = () => {
    resetForm();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    resetForm();
  };

  const handleSelectProduct = (product) => {
    if (items.find((item) => item.productId === product._id)) {
      setSearchTerm("");
      return;
    }
    // Default the unit cost to the sale price — the buyer adjusts it to
    // what the supplier actually charges.
    setItems([
      ...items,
      {
        productId: product._id,
        name: product.name,
        quantity: 1,
        unitCost: product.price,
      },
    ]);
    setSearchTerm("");
  };

  const handleItemChange = (productId, field, value) => {
    setItems(
      items.map((item) =>
        item.productId === productId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setSupplierId(order.supplier?._id || order.supplier || "");
    setItems(
      (order.items || [])
        .filter((item) => item.product)
        .map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          unitCost: item.unitCost,
        }))
    );
    setNotes(order.notes || "");
    setSearchTerm("");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      const payload = {
        supplier: supplierId,
        items: items.map((item) => ({
          product: item.productId,
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost),
        })),
        notes: notes.trim(),
      };
      if (editOrder) {
        await axiosSecure.put(`/purchase-orders/${editOrder._id}`, payload);
        toast.success("Purchase order updated successfully.");
      } else {
        payload.status = createStatus;
        await axiosSecure.post(`/purchase-orders`, payload);
        toast.success("Purchase order created successfully.");
      }
      handleCloseDialog();
      purchaseOrderRefetch();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to save purchase order."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Status moves that need no confirmation (draft -> ordered).
  const handleMarkOrdered = async (order) => {
    try {
      await axiosSecure.put(`/purchase-orders/${order._id}`, {
        status: "ordered",
      });
      toast.success("Purchase order marked as ordered.");
      purchaseOrderRefetch();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to update purchase order."
      );
    }
  };

  const handleConfirmAction = async () => {
    if (!confirm) return;
    const { action, order } = confirm;
    setConfirm(null);
    try {
      if (action === "receive") {
        const res = await axiosSecure.post(
          `/purchase-orders/${order._id}/receive`
        );
        toast.success("Purchase order received — stock updated.");
        if (res.data?.skippedItems?.length) {
          toast.error(
            `${res.data.skippedItems.length} item${
              res.data.skippedItems.length === 1 ? "" : "s"
            } skipped: product no longer exists.`
          );
        }
        purchaseOrderRefetch();
        refetchProducts();
      } else if (action === "cancel") {
        await axiosSecure.put(`/purchase-orders/${order._id}`, {
          status: "canceled",
        });
        toast.success("Purchase order canceled.");
        purchaseOrderRefetch();
      } else if (action === "delete") {
        await axiosSecure.delete(`/purchase-orders/${order._id}`);
        toast.success("Purchase order deleted successfully.");
        purchaseOrderRefetch();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to update purchase order."
      );
    }
  };

  // Stock impact preview for the receive confirmation dialog.
  const receivePreview = (order) =>
    (order.items || []).map((item) => {
      const product = (products || []).find(
        (p) => p._id === item.product?._id
      );
      if (!product) {
        return {
          key: item.product?._id || item._id,
          text: `${item.product?.name || "Unknown product"} — product no longer exists, will be skipped.`,
        };
      }
      return {
        key: product._id,
        text: `${product.name}: stock ${product.stock} → ${
          (Number(product.stock) || 0) + item.quantity
        } (+${item.quantity})`,
      };
    });

  const totalCost = (purchaseOrders || []).reduce(
    (sum, order) => sum + (Number(order.totalCost) || 0),
    0
  );

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        color="primary.main"
      >
        Manage Purchase Orders
      </Typography>

      {canEdit ? (
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          endIcon={<Plus className="h-4 w-4" />}
          sx={{ mt: 2 }}
        >
          New Purchase Order
        </Button>
      ) : null}

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editOrder ? "Edit Purchase Order" : "Create a Purchase Order"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="po-supplier-label">Supplier</InputLabel>
              <Select
                labelId="po-supplier-label"
                label="Supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                {(suppliers || []).map((supplier) => (
                  <MenuItem key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
              {suppliers?.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  No suppliers yet — add one on the Suppliers page first.
                </Typography>
              )}
            </FormControl>

            {/* Product picker — Autocomplete renders its dropdown in a
                portal, so the dialog never resizes or jumps while typing. */}
            <Autocomplete
              options={products || []}
              getOptionLabel={(product) =>
                `${product.name} - $${product.price}`
              }
              isOptionEqualToValue={(option, value) =>
                option._id === value._id
              }
              value={null}
              inputValue={searchTerm}
              onInputChange={(event, value) => setSearchTerm(value)}
              onChange={(event, value) => {
                if (value) handleSelectProduct(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add product"
                  placeholder="Search for a product..."
                  fullWidth
                />
              )}
            />

            {items.length > 0 && (
              <div className="grid gap-2">
                <Typography variant="body2" fontWeight={500}>
                  Items
                </Typography>
                {items.map((item) => (
                  <Paper
                    key={item.productId}
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 1,
                      p: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ flex: 1, minWidth: 120 }}>
                      {item.name}
                    </Typography>
                    <TextField
                      label="Qty"
                      type="number"
                      size="small"
                      inputProps={{ min: 1, step: 1 }}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.productId,
                          "quantity",
                          e.target.value
                        )
                      }
                      sx={{ width: 80 }}
                    />
                    <TextField
                      label="Unit cost"
                      type="number"
                      size="small"
                      inputProps={{ min: 0, step: "0.01" }}
                      value={item.unitCost}
                      onChange={(e) =>
                        handleItemChange(
                          item.productId,
                          "unitCost",
                          e.target.value
                        )
                      }
                      sx={{ width: 110 }}
                    />
                    <Typography variant="body2" sx={{ minWidth: 64 }}>
                      $
                      {(
                        (Number(item.quantity) || 0) *
                        (Number(item.unitCost) || 0)
                      ).toFixed(2)}
                    </Typography>
                    <Button
                      type="button"
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() =>
                        setItems(
                          items.filter(
                            (i) => i.productId !== item.productId
                          )
                        )
                      }
                    >
                      Remove
                    </Button>
                  </Paper>
                ))}
              </div>
            )}

            <TextField
              label="Total Cost"
              fullWidth
              InputProps={{ readOnly: true }}
              value={`$${dialogTotal.toFixed(2)}`}
            />

            {!editOrder && (
              <FormControl fullWidth>
                <InputLabel id="po-status-label">Status</InputLabel>
                <Select
                  labelId="po-status-label"
                  label="Status"
                  value={createStatus}
                  onChange={(e) => setCreateStatus(e.target.value)}
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="ordered">Ordered</MenuItem>
                </Select>
              </FormControl>
            )}

            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={!canSave}>
            {isSaving
              ? "Saving..."
              : editOrder
                ? "Save Changes"
                : "Create Order"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* One confirm dialog for receive / cancel / delete */}
      <Dialog open={!!confirm} onClose={() => setConfirm(null)}>
        <DialogTitle>
          {confirm?.action === "receive" &&
            `Receive purchase order ${shortId(confirm.order._id)}?`}
          {confirm?.action === "cancel" &&
            `Cancel purchase order ${shortId(confirm.order._id)}?`}
          {confirm?.action === "delete" &&
            `Delete purchase order ${shortId(confirm.order._id)}?`}
        </DialogTitle>
        <DialogContent>
          {confirm?.action === "receive" && (
            <>
              <DialogContentText>
                The items below will be added to your stock:
              </DialogContentText>
              <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                {receivePreview(confirm.order).map((line) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={line.key}
                    sx={{ mt: 0.5 }}
                  >
                    {line.text}
                  </Typography>
                ))}
              </Box>
            </>
          )}
          {confirm?.action === "cancel" && (
            <DialogContentText>
              A canceled order cannot be changed afterwards. You can still
              delete it.
            </DialogContentText>
          )}
          {confirm?.action === "delete" && (
            <DialogContentText>
              This purchase order will be permanently deleted.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirm?.action === "receive" ? "primary" : "error"}
            onClick={handleConfirmAction}
          >
            {confirm?.action === "receive" && "Receive"}
            {confirm?.action === "cancel" && "Cancel order"}
            {confirm?.action === "delete" && "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {purchaseOrdersLoading ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading purchase orders...
        </Typography>
      ) : !purchaseOrders?.length ? (
        <Paper variant="outlined" sx={{ mt: 2, py: 6, textAlign: "center" }}>
          <Box
            sx={{
              color: "text.secondary",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ClipboardList className="h-10 w-10" />
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            No purchase orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create your first purchase order to restock from a supplier.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Order</TableCell>
                <TableCell sx={headerCellSx}>Supplier</TableCell>
                <TableCell sx={headerCellSx}>Items</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Total Cost
                </TableCell>
                <TableCell sx={headerCellSx}>Status</TableCell>
                <TableCell sx={headerCellSx}>Date</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseOrders.map((order) => (
                <TableRow key={order._id} sx={zebraRowSx}>
                  <TableCell
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {shortId(order._id)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {order.supplier?.name || "Unknown Supplier"}
                  </TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {(order.items || []).map((item, index) => (
                        <li key={index}>
                          {item.product?.name || "Unknown"} (x{item.quantity}
                          {" @ "}
                          {formatPrice(item.unitCost)})
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 500 }}
                    className="tabular-nums"
                  >
                    {formatPrice(order.totalCost)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={capitalize(order.status)}
                      color={STATUS_CHIP_COLOR[order.status] || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    {!canEdit && !canDelete ? (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {canEdit && order.status === "draft" && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleMarkOrdered(order)}
                          >
                            Mark ordered
                          </Button>
                        )}
                        {canEdit && order.status === "ordered" && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              setConfirm({ action: "receive", order })
                            }
                          >
                            Receive
                          </Button>
                        )}
                        {canEdit &&
                          (order.status === "draft" ||
                            order.status === "ordered") && (
                            <>
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(order)}
                                aria-label={`Edit purchase order ${shortId(order._id)}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </IconButton>
                              <Button
                                size="small"
                                onClick={() =>
                                  setConfirm({ action: "cancel", order })
                                }
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        {canDelete && order.status !== "received" && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setConfirm({ action: "delete", order })
                            }
                            aria-label={`Delete purchase order ${shortId(order._id)}`}
                          >
                            <Trash className="h-4 w-4" />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} sx={{ color: "text.secondary" }}>
                  {purchaseOrders.length} purchase order
                  {purchaseOrders.length === 1 ? "" : "s"}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  Total cost
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600 }}
                  className="tabular-nums"
                >
                  {formatPrice(totalCost)}
                </TableCell>
                <TableCell colSpan={3} />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ManagePurchaseOrders;
