import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import imageUpload from "@/utility/imageUpload";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { id } = useParams();
  const { refetch } = useShop();
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["single-product", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (product) {
      setValue("name", product.name || "");
      setValue("description", product.description || "");
      setValue("price", product.price ?? "");
      setValue("stock", product.stock ?? "");
      setValue("category", product.category || "");
      setValue("rating", product.rating ?? "");
      setImageUrl(product.image || "");
    }
  }, [product, setValue]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = await imageUpload(file);
      if (url) {
        setImageUrl(url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category,
        rating: Number(data.rating),
        image: imageUrl,
      };
      await axiosSecure.put(`/products/${id}`, payload);
      toast.success("Product updated successfully!");
      refetch();
      navigate("/dashboard/products");
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-lg text-muted-foreground">Product not found.</p>
        <Button className="mt-4" onClick={() => navigate("/dashboard/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-4xl font-bold text-primary">
            Update Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Product name is required" })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Product Image</Label>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Current product"
                  className="h-20 w-20 rounded-lg object-cover"
                />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="rounded border p-2"
              />
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
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock", {
                    required: "Stock quantity is required",
                  })}
                />
                {errors.stock && (
                  <p className="text-sm text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => setValue("category", value)}
                  defaultValue={product.category}
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  {...register("rating", {
                    required: "Product rating is required",
                  })}
                />
                {errors.rating && (
                  <p className="text-sm text-red-500">
                    {errors.rating.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/dashboard/products")}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? "Saving..." : "Update Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProduct;
