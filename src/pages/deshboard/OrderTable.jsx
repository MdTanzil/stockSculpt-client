/* eslint-disable react/prop-types */
import OrderStatusBadge from "@/components/order-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import formatDate from "@/utils/formatDate";
import { ClipboardList, Pencil, Trash } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PR";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const shortId = (id) => (id ? `#${String(id).slice(-6).toUpperCase()}` : "—");

const OrderTable = ({ orders, onEdit, onDelete }) => {
  if (!orders?.length) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-background py-12 text-center">
        <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">No orders yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first order to start tracking sales.
        </p>
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.totalPrice) || 0),
    0
  );

  return (
    <div className="mt-4 bg-background">
      <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-10 py-2">Order</TableHead>
              <TableHead className="h-10 py-2">Shop</TableHead>
              <TableHead className="h-10 py-2">Products</TableHead>
              <TableHead className="h-10 py-2 text-right">Total</TableHead>
              <TableHead className="h-10 py-2">Status</TableHead>
              <TableHead className="h-10 py-2">Date</TableHead>
              <TableHead className="h-10 py-2 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="py-2 font-mono text-xs font-medium">
                  {shortId(order._id)}
                </TableCell>
                <TableCell className="py-2 font-medium">
                  {order.shop?.name || "Unknown Shop"}
                </TableCell>
                <TableCell className="py-2">
                  <ul className="space-y-1">
                    {(order.products || []).map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={item.product?.image}
                            alt={item.product?.name || "Product"}
                            className="rounded-lg"
                          />
                          <AvatarFallback className="rounded-lg text-xs">
                            {getInitials(item.product?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {item.product?.name || "Unknown"} (x{item.quantity})
                        </span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="py-2 text-right font-medium tabular-nums">
                  {formatPrice(order.totalPrice)}
                </TableCell>
                <TableCell className="py-2">
                  <OrderStatusBadge status={order.orderStatus} />
                </TableCell>
                <TableCell className="py-2 text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(order)}
                      aria-label="Edit order"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(order._id)}
                      aria-label="Delete order"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="py-2 text-muted-foreground">
                {orders.length} order{orders.length === 1 ? "" : "s"}
              </TableCell>
              <TableCell className="py-2 text-right font-medium">
                Total (all orders)
              </TableCell>
              <TableCell className="py-2 text-right font-semibold tabular-nums">
                {formatPrice(totalRevenue)}
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;
