/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardList, Pencil, Trash } from "lucide-react";

const statusVariant = {
  completed: "default",
  pending: "secondary",
  canceled: "destructive",
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PR";

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

  return (
    <div className="mt-4 bg-background">
      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Shop</TableHead>
              <TableHead className="h-9 py-2">Products</TableHead>
              <TableHead className="h-9 py-2">Total Price</TableHead>
              <TableHead className="h-9 py-2">Status</TableHead>
              <TableHead className="h-9 py-2">Created At</TableHead>
              <TableHead className="h-9 py-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="py-2 font-medium">
                  {order.shop?.name || "Unknown Shop"}
                </TableCell>
                <TableCell className="py-2">
                  <ul className="space-y-1">
                    {(order.products || []).map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={item.product?.image}
                            alt={item.product?.name || "Product"}
                          />
                          <AvatarFallback>
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
                <TableCell className="py-2 font-medium">
                  ${(Number(order.totalPrice) || 0).toFixed(2)}
                </TableCell>
                <TableCell className="py-2 capitalize">
                  <Badge
                    variant={statusVariant[order.orderStatus] || "secondary"}
                  >
                    {order.orderStatus || "pending"}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit(order)}
                      aria-label="Edit order"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDelete(order._id)}
                      variant="destructive"
                      aria-label="Delete order"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {orders.length} order{orders.length === 1 ? "" : "s"}
      </p>
    </div>
  );
};

export default OrderTable;
