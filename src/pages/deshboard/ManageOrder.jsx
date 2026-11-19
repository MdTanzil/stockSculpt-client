import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import OrderTable from "./OrderTable";

const ManageOrder = () => {
  const { products, orderRefetch, orders, orderLoading } = useShop();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Add selected product to the form
  const handleSelectProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setSearchTerm(""); // Clear search after selecting
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p._id === productId ? { ...p, quantity: Number(quantity) } : p
      )
    );
  };

  // Calculate total price
  const totalPrice = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  // Get the selected value
  const selectedStatus = watch("orderStatus");

  const handleCloseDialog = () => {
    setOpen(false);
    reset(); // Reset the form fields
    setSelectedProducts([]);
    setSelectedOrder(null);
    setSearchTerm("");
  };

  // Change an order's status inline from the orders table
  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      await axiosSecure.put(`/order/${orderId}`, { orderStatus });
      toast.success("Order status updated.");
      orderRefetch();
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  const onSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product for the order.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        products: selectedProducts.map((p) => ({
          product: p._id,
          quantity: p.quantity,
        })),
        orderStatus: selectedStatus || "pending",
        totalPrice,
      };

      if (selectedOrder) {
        // If editing, update order
        await axiosSecure.put(`/order/${selectedOrder._id}`, payload);
        toast.success("Order updated successfully!");
      } else {
        // If new order, create
        await axiosSecure.post(`/order`, payload);
        toast.success("Order added successfully!");
      }

      reset();
      setSelectedProducts([]);
      setSelectedOrder(null);
      setOpen(false);
      orderRefetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save order.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an order
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axiosSecure.delete(`/order/${orderId}`);
      orderRefetch();
      toast.success("Order deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  // Edit an order — populate the form directly instead of relying on
  // an effect: the old effect only re-ran when selectedOrder changed
  // identity, so editing the same order twice did nothing, and a
  // cancelled edit left stale state behind.
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setSelectedProducts(
      (order.products || [])
        .filter((p) => p.product)
        .map((p) => ({
          _id: p.product._id,
          name: p.product.name,
          price: p.product.price,
          quantity: p.quantity,
        }))
    );
    setValue("orderStatus", order.orderStatus);
    setSearchTerm("");
    setOpen(true);
  };
  return (
    <div>
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main">
        Manage Your Orders
      </Typography>

      <Button
        variant="contained"
        onClick={() => {
          setSelectedOrder(null);
          setSearchTerm("");
          setOpen(true);
        }}
        endIcon={<Plus className="h-4 w-4" />}
      >
        Add Order
      </Button>
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {selectedOrder ? "Edit Order" : "Create a New Order"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {/* Search Product — Autocomplete renders its dropdown in a
                  portal, so the dialog never resizes or jumps while
                  typing (the old in-flow results list did). */}
              <Autocomplete
                options={products}
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
                    label="Search Product"
                    placeholder="Search for a product..."
                    fullWidth
                  />
                )}
              />

              {/* Selected Products List */}
              {selectedProducts.length > 0 && (
                <div className="grid gap-2">
                  <Typography variant="body2" fontWeight={500}>
                    Selected Products
                  </Typography>
                  {selectedProducts.map((product) => (
                    <Paper
                      key={product._id}
                      variant="outlined"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                      }}
                    >
                      <Typography variant="body2">
                        {product.name} - ${product.price}
                      </Typography>
                      <TextField
                        type="number"
                        size="small"
                        inputProps={{ min: 1 }}
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                        sx={{ width: 80 }}
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ${product.price * product.quantity}
                      </Typography>
                      <Button
                        type="button"
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                          setSelectedProducts(
                            selectedProducts.filter(
                              (p) => p._id !== product._id
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

              {/* Total Price */}
              <TextField
                label="Total Price"
                fullWidth
                InputProps={{ readOnly: true }}
                value={`$${totalPrice}`}
              />

              <FormControl fullWidth error={!!errors.orderStatus}>
                <InputLabel id="order-status-label">Order Status</InputLabel>
                <Select
                  labelId="order-status-label"
                  id="orderStatus"
                  label="Order Status"
                  value={selectedStatus || ""}
                  onChange={(e) => setValue("orderStatus", e.target.value)}
                >
                  <MenuItem value="pending">pending</MenuItem>
                  <MenuItem value="completed">completed</MenuItem>
                  <MenuItem value="canceled">canceled</MenuItem>
                </Select>
                {errors.orderStatus && (
                  <FormHelperText>{errors.orderStatus.message}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="button" variant="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Order"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {orderLoading ? (
        <Typography variant="body1">Loading orders...</Typography>
      ) : (
        <OrderTable
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ManageOrder;
