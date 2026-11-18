/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Package, Pencil, Star, Trash } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PR";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const getStockBadge = (stock) => {
  if (stock <= 0) return <Badge variant="destructive">Out of stock</Badge>;
  if (stock <= 5) {
    return (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100"
      >
        Low: {stock}
      </Badge>
    );
  }
  return <span className="tabular-nums">{stock}</span>;
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

  const stockValue = products.reduce(
    (sum, product) =>
      sum + (Number(product.price) || 0) * (Number(product.stock) || 0),
    0
  );

  return (
    <div className="bg-background">
      <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-10 py-2">Image</TableHead>
              <TableHead className="h-10 py-2">Name</TableHead>
              <TableHead className="h-10 py-2">Description</TableHead>
              <TableHead className="h-10 py-2">Category</TableHead>
              <TableHead className="h-10 py-2 text-right">Price</TableHead>
              <TableHead className="h-10 py-2 text-right">Rating</TableHead>
              <TableHead className="h-10 py-2 text-right">Stock</TableHead>
              <TableHead className="h-10 py-2 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="py-2">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage
                      src={product.image}
                      alt={product.name}
                      className="rounded-lg"
                    />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(product.name)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="py-2 font-medium">
                  {product.name}
                </TableCell>
                <TableCell className="py-2 max-w-[220px] truncate text-muted-foreground">
                  {product.description}
                </TableCell>
                <TableCell className="py-2">{product.category}</TableCell>
                <TableCell className="py-2 text-right tabular-nums">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell className="py-2 text-right">
                  {product.rating != null && product.rating !== "" ? (
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {Number(product.rating).toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-2 text-right">
                  {getStockBadge(Number(product.stock) || 0)}
                </TableCell>
                <TableCell className="py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(product)}
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(product._id)}
                      aria-label={`Delete ${product.name}`}
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
              <TableCell
                colSpan={4}
                className="py-2 text-muted-foreground"
              >
                {products.length} product{products.length === 1 ? "" : "s"}
              </TableCell>
              <TableCell colSpan={3} className="py-2 text-right font-medium">
                Total stock value
              </TableCell>
              <TableCell className="py-2 text-right font-semibold tabular-nums">
                {formatPrice(stockValue)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default ProductTable;
