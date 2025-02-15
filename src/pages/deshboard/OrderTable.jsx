/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";

const OrderTable = ({ orders, onEdit, onDelete }) => {
  if (!orders?.length)
    return <p className="text-center mt-4">No orders found.</p>;

  return (
    <div className="bg-background">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
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
                  <ul>
                    {order.products.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={item.product?.image || "/placeholder.png"}
                            alt={item.product?.name || "Product"}
                          />
                          <AvatarFallback>PR</AvatarFallback>
                        </Avatar>
                        <span>
                          {item.product?.name || "Unknown"} (x{item.quantity})
                        </span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="py-2">
                  ${order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell className="py-2 capitalize">
                  {order.orderStatus}
                </TableCell>
                <TableCell className="py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onEdit(order)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDelete(order._id)}
                      variant="destructive"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Order Table
      </p>
    </div>
  );
};

export default OrderTable;
