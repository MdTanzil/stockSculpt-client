import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useShop from "@/hooks/useShop";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download, FileText } from "lucide-react";

const generateInvoicePDF = (order, shopName) => {
  const pdf = new jsPDF();

  pdf.text(`Invoice - ${shopName || "StockSculpt"}`, 14, 22);
  pdf.setFontSize(11);
  pdf.text(`Order ID: ${order._id}`, 14, 32);
  pdf.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    14,
    40
  );
  pdf.text(`Status: ${order.orderStatus || "pending"}`, 14, 48);

  pdf.autoTable({
    startY: 56,
    head: [["Product", "Quantity", "Price", "Total"]],
    body: (order.products || []).map((item) => [
      item.product?.name || "Unknown product",
      item.quantity,
      `$${Number(item.product?.price || 0).toFixed(2)}`,
      `$${(Number(item.product?.price || 0) * item.quantity).toFixed(2)}`,
    ]),
  });

  pdf.text(
    `Total: $${(Number(order.totalPrice) || 0).toFixed(2)}`,
    14,
    pdf.autoTable.previous.finalY + 10
  );

  pdf.save(`invoice-${order._id}.pdf`);
};

const CheckOut = () => {
  const { shop, orders = [], orderLoading } = useShop();

  if (orderLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

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
        <div className="overflow-x-auto rounded-lg border border-border bg-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-9 py-2">Order</TableHead>
                <TableHead className="h-9 py-2">Date</TableHead>
                <TableHead className="h-9 py-2">Items</TableHead>
                <TableHead className="h-9 py-2">Status</TableHead>
                <TableHead className="h-9 py-2">Total</TableHead>
                <TableHead className="h-9 py-2">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow key={order._id}>
                  <TableCell className="py-2 font-medium">
                    Order #{idx + 1}
                  </TableCell>
                  <TableCell className="py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-2">
                    {order.products?.length || 0} item
                    {order.products?.length === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell className="py-2 capitalize">
                    {order.orderStatus}
                  </TableCell>
                  <TableCell className="py-2 font-medium">
                    ${(Number(order.totalPrice) || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateInvoicePDF(order, shop?.name)}
                      aria-label={`Download invoice for order ${idx + 1}`}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CheckOut;
