import OrderStatusBadge from "@/components/order-status-badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useShop from "@/hooks/useShop";
import formatDate from "@/utils/formatDate";
import generateInvoicePDF from "@/utils/generateInvoicePDF";
import { Download, FileText } from "lucide-react";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const headerCellSx = {
  textTransform: "uppercase",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
};

const zebraRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
};

const CheckOut = () => {
  const { shop, orders = [], orderLoading } = useShop();

  if (orderLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Typography variant="h6" color="text.secondary">
          Loading orders...
        </Typography>
      </div>
    );
  }

  const totalInvoiced = orders.reduce(
    (sum, order) => sum + (Number(order.totalPrice) || 0),
    0
  );

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main">
        Checkout
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary">
        Download a PDF invoice for any of your orders.
      </Typography>

      {orders.length === 0 ? (
        <Paper variant="outlined" sx={{ py: 6, textAlign: "center" }}>
          <Box sx={{ color: "text.secondary", display: "flex", justifyContent: "center" }}>
            <FileText className="h-10 w-10" />
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            No orders to invoice yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create an order from the Orders page, then come back here to
            download its invoice.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Order</TableCell>
                <TableCell sx={headerCellSx}>Date</TableCell>
                <TableCell sx={headerCellSx}>Items</TableCell>
                <TableCell sx={headerCellSx}>Status</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Total
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Invoice
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow key={order._id} sx={zebraRowSx}>
                  <TableCell sx={{ fontWeight: 500 }}>
                    Order #{idx + 1}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {order.products?.length || 0} item
                    {order.products?.length === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }} className="tabular-nums">
                    {formatPrice(order.totalPrice)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => generateInvoicePDF(order, shop)}
                      aria-label={`Download invoice for order ${idx + 1}`}
                      startIcon={<Download className="h-4 w-4" />}
                    >
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} sx={{ color: "text.secondary" }}>
                  {orders.length} order{orders.length === 1 ? "" : "s"}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  Total invoiced
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }} className="tabular-nums">
                  {formatPrice(totalInvoiced)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CheckOut;
