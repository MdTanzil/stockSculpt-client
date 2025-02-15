import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  SelectValue,
} from "@/components/ui/select";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import OrderTable from "./OrderTable";

const ManageOrder = () => {
  const { shop, products, orderRefetch, orders, orderLoading } = useShop();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const axiosSecure = useAxiosSecure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  console.log(orders);

  // Filter products based on search input
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add selected product to the form
  const handleSelectProduct = (product) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
    setSearchTerm(""); // Clear search after selecting
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p._id === productId ? { ...p, quantity: Number(quantity) } : p
      )
    );
  };

  // Calculate total price
  const totalPrice = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  // Get the selected value
  const selectedCategory = watch("category");

  console.log(selectedCategory); // Logs the selected value

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        products: selectedProducts.map((p) => ({
          product: p._id,
          quantity: p.quantity,
        })),
        status: selectedCategory,
        totalPrice,
      };

      if (selectedOrder) {
        // If editing, update order
        await axiosSecure.put(`/order/${selectedOrder._id}`, payload);
        toast.success("Order updated successfully!");
      } else {
        // If new order, create
        await axiosSecure.post(`/order`, payload);
        toast.success("Order added successfully!");
      }

      reset();
      setSelectedProducts([]);
      setSelectedOrder(null);
      setOpen(false);
      orderRefetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save order.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an order
  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axiosSecure.delete(`/order/${orderId}`);
      orderRefetch();
      toast.success("Order deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete order.");
    }
  };

  // Edit an order
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  useEffect(() => {
    if (selectedOrder) {
      // Populate form fields when editing
      setSelectedProducts(
        selectedOrder.products.map((p) => ({
          _id: p.product._id,
          name: p.product.name,
          price: p.product.price,
          quantity: p.quantity,
        }))
      );
      setValue("category", selectedOrder.status);
      setOpen(true); // Open modal when editing
    }
  }, [selectedOrder, setValue]);
  return (
    <div>
      <p className="text-center font-bold text-4xl text-primary">
        Manage Your Orders
      </p>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            // Reset editProduct when dialog is closed
            reset(); // Reset the form fields
            setSelectedProducts([]);
            // Clear uploaded image URL
          }
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>
            Add Order <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create a New Order</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Search Product Input */}
              <div className="grid gap-2">
                <Label htmlFor="search">Search Product</Label>
                <Input
                  id="search"
                  placeholder="Search for a product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="border rounded p-2 max-h-40 overflow-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                        onClick={() => handleSelectProduct(product)}
                      >
                        {product.name} - ${product.price}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Products List */}
              {selectedProducts.length > 0 && (
                <div className="grid gap-2">
                  <Label>Selected Products</Label>
                  {selectedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex justify-between items-center border p-2 rounded"
                    >
                      <span>
                        {product.name} - ${product.price}
                      </span>
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(product._id, e.target.value)
                        }
                        className="w-20"
                      />
                      <span className="ml-2">
                        ${product.price * product.quantity}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setSelectedProducts(
                            selectedProducts.filter(
                              (p) => p._id !== product._id
                            )
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Price */}
              <div className="grid gap-2">
                <Label>Total Price</Label>
                <Input readOnly value={`$${totalPrice}`} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Order Status</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="completed">completed</SelectItem>
                    <SelectItem value="canceled">canceled</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
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
                {isLoading ? "Saving..." : "Save Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {orderLoading ? (
        <p>Loading orders...</p>
      ) : (
        <OrderTable
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ManageOrder;
