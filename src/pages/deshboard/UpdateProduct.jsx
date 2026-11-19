import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
    watch,
    formState: { errors },
  } = useForm();

  // react-hook-form's register ref must target the underlying <input>, so
  // split it off and pass it as inputRef (MUI forwards `ref` to the root).
  const { ref: nameRef, ...nameProps } = register("name", {
    required: "Product name is required",
  });
  const { ref: descriptionRef, ...descriptionProps } = register("description", {
    required: "Description is required",
  });
  const { ref: priceRef, ...priceProps } = register("price", {
    required: "Price is required",
  });
  const { ref: stockRef, ...stockProps } = register("stock", {
    required: "Stock quantity is required",
  });
  const { ref: ratingRef, ...ratingProps } = register("rating", {
    required: "Product rating is required",
  });

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
        <Typography variant="h6" color="text.secondary">
          Loading product...
        </Typography>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Typography variant="h6" color="text.secondary">
          Product not found.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/dashboard/products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            fontWeight={700}
            color="primary.main"
          >
            Update Product
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
            <TextField
              id="name"
              label="Product Name"
              fullWidth
              inputRef={nameRef}
              {...nameProps}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <div className="grid gap-2">
              <Typography variant="body2" fontWeight={500}>
                Product Image
              </Typography>
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
            <TextField
              id="description"
              label="Description"
              fullWidth
              inputRef={descriptionRef}
              {...descriptionProps}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="price"
                label="Price ($)"
                type="number"
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                inputRef={priceRef}
                {...priceProps}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
              <TextField
                id="stock"
                label="Stock Quantity"
                type="number"
                fullWidth
                inputProps={{ min: 0 }}
                inputRef={stockRef}
                {...stockProps}
                error={!!errors.stock}
                helperText={errors.stock?.message}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  label="Category"
                  value={watch("category") || ""}
                  onChange={(e) => setValue("category", e.target.value)}
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="rating"
                label="Rating"
                type="number"
                fullWidth
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                inputRef={ratingRef}
                {...ratingProps}
                error={!!errors.rating}
                helperText={errors.rating?.message}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outlined"
                className="flex-1"
                onClick={() => navigate("/dashboard/products")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="flex-1"
                disabled={isSaving}
              >
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
