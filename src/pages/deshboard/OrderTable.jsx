/* eslint-disable react/prop-types */
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import formatDate from "@/utils/formatDate";
import OrderStatusBadge from "@/components/order-status-badge";
import { ClipboardList, Pencil, SearchX, Trash } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PR";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const shortId = (id) => (id ? `#${String(id).slice(-6).toUpperCase()}` : "—");

const headerCellSx = {
  textTransform: "uppercase",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
};

const zebraRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
};

const STATUS_OPTIONS = ["pending", "completed", "canceled"];

const capitalize = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const OrderTable = ({
  orders,
  onEdit,
  onDelete,
  onStatusChange,
  canEdit,
  canDelete,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  if (!orders?.length) {
    if (hasActiveFilters) {
      return (
        <Paper variant="outlined" sx={{ mt: 2, py: 6, textAlign: "center" }}>
          <Box sx={{ color: "text.secondary", display: "flex", justifyContent: "center" }}>
            <SearchX className="h-10 w-10" />
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            No orders match your filters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Try adjusting your search or filters.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={onClearFilters}>
            Clear filters
          </Button>
        </Paper>
      );
    }
    return (
      <Paper variant="outlined" sx={{ mt: 2, py: 6, textAlign: "center" }}>
        <Box sx={{ color: "text.secondary", display: "flex", justifyContent: "center" }}>
          <ClipboardList className="h-10 w-10" />
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          No orders yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Add your first order to start tracking sales.
        </Typography>
      </Paper>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.totalPrice) || 0),
    0
  );

  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellSx}>Order</TableCell>
              <TableCell sx={headerCellSx}>Shop</TableCell>
              <TableCell sx={headerCellSx}>Products</TableCell>
              <TableCell sx={headerCellSx} align="right">
                Total
              </TableCell>
              <TableCell sx={headerCellSx}>Status</TableCell>
              <TableCell sx={headerCellSx}>Date</TableCell>
              <TableCell sx={headerCellSx} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} sx={zebraRowSx}>
                <TableCell
                  sx={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 500 }}
                >
                  {shortId(order._id)}
                  {order.source === "pos" ? (
                    <Chip
                      label="POS"
                      color="info"
                      size="small"
                      sx={{ ml: 1, height: 20, fontSize: "0.625rem" }}
                    />
                  ) : null}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {order.shop?.name || "Unknown Shop"}
                </TableCell>
                <TableCell>
                  <ul className="space-y-1">
                    {(order.products || []).map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Avatar
                          src={item.product?.image}
                          alt={item.product?.name || "Product"}
                          variant="rounded"
                          sx={{ width: 32, height: 32, fontSize: "0.75rem" }}
                        >
                          {getInitials(item.product?.name)}
                        </Avatar>
                        <span>
                          {item.product?.name || "Unknown"} (x{item.quantity})
                        </span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }} className="tabular-nums">
                  {formatPrice(order.totalPrice)}
                  {order.paymentMethod ? (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {capitalize(order.paymentMethod)}
                    </Typography>
                  ) : null}
                </TableCell>
                <TableCell>
                  {canEdit ? (
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                      <Select
                        value={order.orderStatus || "pending"}
                        onChange={(e) =>
                          onStatusChange(order._id, e.target.value)
                        }
                        aria-label="Change order status"
                        sx={{ fontSize: "0.8125rem" }}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <MenuItem key={status} value={status}>
                            {capitalize(status)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <OrderStatusBadge status={order.orderStatus} />
                  )}
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
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                      {canEdit ? (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(order)}
                          aria-label="Edit order"
                        >
                          <Pencil className="h-4 w-4" />
                        </IconButton>
                      ) : null}
                      {canDelete ? (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(order._id)}
                          aria-label="Delete order"
                        >
                          <Trash className="h-4 w-4" />
                        </IconButton>
                      ) : null}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} sx={{ color: "text.secondary" }}>
                {totalCount != null && totalCount !== orders.length
                  ? `Showing ${orders.length} of ${totalCount} orders`
                  : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 500 }}>
                {totalCount != null && totalCount !== orders.length
                  ? "Total (shown orders)"
                  : "Total (all orders)"}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }} className="tabular-nums">
                {formatPrice(totalRevenue)}
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderTable;
