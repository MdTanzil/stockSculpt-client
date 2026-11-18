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
import { Package, Pencil, Trash } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PR";

const getStockBadge = (stock) => {
  if (stock <= 0) return <Badge variant="destructive">Out of stock</Badge>;
  if (stock <= 5) return <Badge variant="secondary">Low: {stock}</Badge>;
  return <span>{stock}</span>;
};

const ProductTable = ({ products, onEdit, onDelete }) => {
  if (!products?.length) {
    return (
      <div className="rounded-lg border border-border bg-background py-12 text-center">
        <Package className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">No products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first product to start managing your inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="overflow-x-auto rounded-lg border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="h-9 py-2">Image</TableHead>
              <TableHead className="h-9 py-2">Name</TableHead>
              <TableHead className="h-9 py-2">Description</TableHead>
              <TableHead className="h-9 py-2">Category</TableHead>
              <TableHead className="h-9 py-2">Price</TableHead>
              <TableHead className="h-9 py-2">Rating</TableHead>
              <TableHead className="h-9 py-2">Stock</TableHead>
              <TableHead className="h-9 py-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="py-2 font-medium">
                  <Avatar>
                    <AvatarImage src={product.image} alt={product.name} />
                    <AvatarFallback>
                      {getInitials(product.name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="py-2 font-medium">
                  {product.name}
                </TableCell>
                <TableCell className="py-2 max-w-[220px] truncate">
                  {product.description}
                </TableCell>
                <TableCell className="py-2">{product.category}</TableCell>
                <TableCell className="py-2">
                  ${(Number(product.price) || 0).toFixed(2)}
                </TableCell>
                <TableCell className="py-2">{product.rating}</TableCell>
                <TableCell className="py-2">
                  {getStockBadge(Number(product.stock) || 0)}
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onEdit(product)}
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDelete(product._id)}
                      variant="destructive"
                      aria-label={`Delete ${product.name}`}
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
        {products.length} product{products.length === 1 ? "" : "s"}
      </p>
    </div>
  );
};

export default ProductTable;
