import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import imageUpload from "@/utility/imageUpload";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ProductTable from "./ProductTable";

const ManageProduct = () => {
  const axiosSecure = useAxiosSecure();
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
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

  const handleCloseDialog = () => {
    setOpen(false);
    setEditProduct(null); // Reset editProduct when dialog is closed
    reset(); // Reset the form fields
    setImageUrl(""); // Clear uploaded image URL
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = await imageUpload(file);
      setImageUrl(url);
    }
  };

  const { products, refetch, isLoading: isProductLoading } = useShop();

  const categories = useMemo(
    () =>
      [...new Set((products || []).map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return (products || []).filter((product) => {
      if (query && !product.name?.toLowerCase().includes(query)) return false;
      if (categoryFilter !== "all" && product.category !== categoryFilter)
        return false;
      if (lowStockOnly && (Number(product.stock) || 0) > 5) return false;
      return true;
    });
  }, [products, searchTerm, categoryFilter, lowStockOnly]);

  const hasActiveFilters =
    searchTerm.trim() !== "" || categoryFilter !== "all" || lowStockOnly;

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLowStockOnly(false);
  };

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
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
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
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main">
        Manage Your Product
      </Typography>
      <div>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          endIcon={<Plus className="h-4 w-4" />}
        >
          {editProduct ? "Edit Product" : "Add Product"}
        </Button>
        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>
              {editProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {editProduct
                  ? "Edit your product details"
                  : "Add your new product to your shop"}
              </Typography>
              <Stack spacing={2} sx={{ pt: 1 }}>
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
                    Upload Image
                  </Typography>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border p-2 rounded"
                  />
                  {imageUrl && (
                    <Typography variant="body2" color="success.main">
                      Image uploaded successfully!
                    </Typography>
                  )}
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
                <TextField
                  id="price"
                  label="Price ($)"
                  type="number"
                  fullWidth
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
                  inputRef={stockRef}
                  {...stockProps}
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
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
                  inputRef={ratingRef}
                  {...ratingProps}
                  error={!!errors.rating}
                  helperText={errors.rating?.message}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button type="button" variant="outlined" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Product"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
      <div className="p-2 mt-4">
        {isProductLoading ? (
          <Typography variant="body1" align="center" color="text.secondary">
            Loading products...
          </Typography>
        ) : (
          <>
            <Paper
              variant="outlined"
              sx={{
                mb: 2,
                p: 1.5,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <TextField
                placeholder="Search products by name..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products by name"
                sx={{ minWidth: 200, flex: 1 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="h-4 w-4" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter by category"
                >
                  <MenuItem value="all">All categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    id="low-stock-only"
                    checked={lowStockOnly}
                    onChange={(e) => setLowStockOnly(e.target.checked)}
                  />
                }
                label="Low stock only"
              />
              {hasActiveFilters && (
                <Button variant="text" size="small" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </Paper>
            <ProductTable
              products={filteredProducts}
              totalCount={products?.length ?? 0}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ManageProduct;
