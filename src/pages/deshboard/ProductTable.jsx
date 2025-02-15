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

const ProductTable = ({ products, onEdit, onDelete }) => {
  if (!products?.length) return <p>No products found.</p>;

  return (
    <div className="bg-background">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
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
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="py-2">{product.name}</TableCell>
                <TableCell className="py-2">{product.description}</TableCell>
                <TableCell className="py-2">{product.category}</TableCell>
                <TableCell className="py-2">${product.price}</TableCell>
                <TableCell className="py-2">{product.rating}</TableCell>
                <TableCell className="py-2">{product.stock}</TableCell>
                <TableCell className="py-2">
                  <div className="flex gap-1 gap-x-4">
                    <Button size="sm" onClick={() => onEdit(product)}>
                      <Pencil />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onDelete(product._id)}
                      variant="destructive"
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Product Table
      </p>
    </div>
  );
};

export default ProductTable;
