import OrderStatusBadge from "@/components/order-status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useShop from "@/hooks/useShop";
import formatDate from "@/utils/formatDate";
import generateInvoicePDF from "@/utils/generateInvoicePDF";
import { Download, FileText } from "lucide-react";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const CheckOut = () => {
  const { shop, orders = [], orderLoading } = useShop();

  if (orderLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  const totalInvoiced = orders.reduce(
    (sum, order) => sum + (Number(order.totalPrice) || 0),
    0
  );

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h2 className="text-center text-4xl font-bold text-primary">Checkout</h2>
      <p className="text-center text-muted-foreground">
        Download a PDF invoice for any of your orders.
      </p>

      {orders.length === 0 ? (
        <div className="rounded-lg border bg-background py-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No orders to invoice yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an order from the Orders page, then come back here to
            download its invoice.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-10 py-2">Order</TableHead>
                <TableHead className="h-10 py-2">Date</TableHead>
                <TableHead className="h-10 py-2">Items</TableHead>
                <TableHead className="h-10 py-2">Status</TableHead>
                <TableHead className="h-10 py-2 text-right">Total</TableHead>
                <TableHead className="h-10 py-2 text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow key={order._id}>
                  <TableCell className="py-2 font-medium">
                    Order #{idx + 1}
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="py-2 tabular-nums">
                    {order.products?.length || 0} item
                    {order.products?.length === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell className="py-2">
                    <OrderStatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell className="py-2 text-right font-medium tabular-nums">
                    {formatPrice(order.totalPrice)}
                  </TableCell>
                  <TableCell className="py-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateInvoicePDF(order, shop)}
                      aria-label={`Download invoice for order ${idx + 1}`}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="py-2 text-muted-foreground">
                  {orders.length} order{orders.length === 1 ? "" : "s"}
                </TableCell>
                <TableCell className="py-2 text-right font-medium">
                  Total invoiced
                </TableCell>
                <TableCell className="py-2 text-right font-semibold tabular-nums">
                  {formatPrice(totalInvoiced)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
