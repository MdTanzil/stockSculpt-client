import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import imageUpload from "@/utility/imageUpload";
import { SelectValue } from "@radix-ui/react-select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ProductTable from "./ProductTable";

const ManageProduct = () => {
  const axiosSecure = useAxiosSecure();
  const { shop } = useShop();
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = await imageUpload(file);
      setImageUrl(url);
    }
  };

  const { products, refetch, isLoading: isProductLoading } = useShop();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        image: imageUrl,
        rating: Number(data.rating),
      };

      let response;
      if (editProduct) {
        response = await axiosSecure.put(
          `/products/${editProduct._id}`,
          payload
        );
      } else {
        response = await axiosSecure.post(`/products`, payload);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Product ${editProduct ? "updated" : "added"} successfully!`
        );
        refetch();
        reset();
        setImageUrl("");
        setOpen(false);
        setEditProduct(null);
      }
    } catch (error) {
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("stock", product.stock);
    setValue("category", product.category);
    setValue("rating", product.rating);
    setImageUrl(product.image);
    setOpen(true);
  };

  const handleDelete = async (productId) => {
    try {
      await axiosSecure.delete(`/products/${productId}`);
      toast.success("Product deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div>
      <p className="text-center font-bold text-4xl text-primary">
        Manage Your Product
      </p>
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setEditProduct(null); // Reset editProduct when dialog is closed
              reset(); // Reset the form fields
              setImageUrl(""); // Clear uploaded image URL
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              {editProduct ? "Edit Product" : "Add Product"} <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>
                  {editProduct ? "Edit Product" : "Add Product"}
                </DialogTitle>
                <DialogDescription>
                  {editProduct
                    ? "Edit your product details"
                    : "Add your new product to your shop"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    {...register("name", {
                      required: "Product name is required",
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Upload Image</Label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border p-2 rounded"
                  />
                  {imageUrl && (
                    <p className="text-green-500 text-sm">
                      Image uploaded successfully!
                    </p>
                  )}
                  {errors.image && (
                    <p className="text-red-500 text-sm">
                      {errors.image.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { required: "Price is required" })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register("stock", {
                      required: "Stock quantity is required",
                    })}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>

                  <Input
                    id="rating"
                    type="number"
                    {...register("rating", {
                      required: "Product rating is required",
                    })}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-2 mt-4">
        {isLoading ? (
          <p>Product Loading</p>
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default ManageProduct;
