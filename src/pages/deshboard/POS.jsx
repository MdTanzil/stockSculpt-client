import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Receipt from "@/components/Receipt";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import formatDate from "@/utils/formatDate";
import generateInvoicePDF from "@/utils/generateInvoicePDF";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  Printer,
  ReceiptText,
  Search,
  ShoppingCart,
  Trash,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const shortId = (id) => `#${String(id || "").slice(-6).toUpperCase()}`;

const POS = () => {
  const axiosSecure = useAxiosSecure();
  const {
    shop,
    products,
    refetch,
    orderRefetch,
    isLoading,
    canEdit,
  } = useShop();
  const [searchTerm, setSearchTerm] = useState("");
  // Cart lines: [{ product, quantity }]. Quantities are capped at the
  // product's current stock; the server re-checks stock at sale time.
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isCompleting, setIsCompleting] = useState(false);
  // The completed sale, once the server confirms it.
  const [sale, setSale] = useState(null);

  if (!shop?._id) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        You do not have a shop yet. Create one to use the point of sale.
      </Typography>
    );
  }

  if (!canEdit) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        Only staff and above can use the point of sale.
      </Typography>
    );
  }

  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const cartQuantity = (productId) =>
    cart.find((line) => line.product._id === productId)?.quantity || 0;

  const addToCart = (product) => {
    const stock = Number(product.stock) || 0;
    const inCart = cartQuantity(product._id);
    if (inCart >= stock) {
      toast.error(
        stock === 0
          ? `${product.name} is out of stock.`
          : `Only ${stock} ${product.name} in stock.`
      );
      return;
    }
    setCart((prev) => {
      const existing = prev.find((line) => line.product._id === product._id);
      if (existing) {
        return prev.map((line) =>
          line.product._id === product._id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((line) => {
          if (line.product._id !== productId) return line;
          const next = line.quantity + delta;
          const stock = Number(line.product.stock) || 0;
          if (next > stock) {
            toast.error(`Only ${stock} ${line.product.name} in stock.`);
            return line;
          }
          return { ...line, quantity: next };
        })
        .filter((line) => line.quantity > 0)
    );
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((line) => line.product._id !== productId));

  const total = cart.reduce(
    (sum, line) => sum + (Number(line.product.price) || 0) * line.quantity,
    0
  );

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    setIsCompleting(true);
    try {
      const res = await axiosSecure.post("/order/pos", {
        items: cart.map((line) => ({
          product: line.product._id,
          quantity: line.quantity,
        })),
        paymentMethod,
      });
      setSale(res.data);
      setCart([]);
      toast.success("Sale completed.");
      refetch();
      orderRefetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Sale failed.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNewSale = () => setSale(null);

  if (sale) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <CheckCircle2
              className="mx-auto h-12 w-12"
              style={{ color: "#16a34a" }}
            />
            <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
              Sale complete
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Order {shortId(sale._id)} · {formatDate(sale.createdAt)} ·{" "}
              {sale.paymentMethod === "card" ? "Card" : "Cash"}
            </Typography>
            <Box sx={{ mt: 3, textAlign: "left" }}>
              {(sale.products || []).map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 0.75,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2">
                    {item.product?.name || "Unknown"} (x{item.quantity})
                  </Typography>
                  <Typography variant="body2" className="tabular-nums">
                    {formatPrice(
                      (Number(item.product?.price) || 0) * item.quantity
                    )}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pt: 1.5,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Total
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  className="tabular-nums"
                >
                  {formatPrice(sale.totalPrice)}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 3 }}
            >
              Receipt preview — prints like a shop receipt (80mm)
            </Typography>
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <Receipt order={sale} shop={shop} />
            </Box>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => window.print()}
                endIcon={<Printer className="h-4 w-4" />}
              >
                Print receipt
              </Button>
              <Button
                variant="outlined"
                onClick={() => generateInvoicePDF(sale, shop)}
                endIcon={<ReceiptText className="h-4 w-4" />}
              >
                Download receipt (PDF)
              </Button>
              <Button
                variant="contained"
                onClick={handleNewSale}
                endIcon={<ShoppingCart className="h-4 w-4" />}
              >
                New sale
              </Button>
            </Box>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main">
        Point of Sale
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 1 }}
      >
        Tap a product to add it to the sale. Stock is decremented when the
        sale completes.
      </Typography>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <TextField
            fullWidth
            label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: <Search className="h-5 w-5" />,
            }}
          />
          {isLoading ? (
            <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
              <Skeleton variant="rounded" height={64} />
              <Skeleton variant="rounded" height={64} />
              <Skeleton variant="rounded" height={64} />
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Paper variant="outlined" sx={{ mt: 2, py: 6, textAlign: "center" }}>
              <Typography variant="h6">No products found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {searchTerm
                  ? "Try a different search."
                  : "Add products to your shop first."}
              </Typography>
            </Paper>
          ) : (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {filteredProducts.map((product) => {
                const stock = Number(product.stock) || 0;
                const inCart = cartQuantity(product._id);
                const outOfStock = stock === 0;
                return (
                  <Card
                    key={product._id}
                    variant="outlined"
                    onClick={() => !outOfStock && addToCart(product)}
                    sx={{
                      cursor: outOfStock ? "not-allowed" : "pointer",
                      opacity: outOfStock ? 0.6 : 1,
                      "&:hover": outOfStock
                        ? {}
                        : { borderColor: "primary.main" },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        py: 1.5,
                        "&:last-child": { pb: 1.5 },
                      }}
                    >
                      <Avatar
                        src={product.image}
                        alt={product.name}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                      >
                        {product.name?.charAt(0)?.toUpperCase() || "P"}
                      </Avatar>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(product.price)} · {stock} in stock
                        </Typography>
                      </Box>
                      {outOfStock ? (
                        <Chip label="Out of stock" size="small" color="error" />
                      ) : inCart > 0 ? (
                        <Chip
                          label={`In sale: ${inCart}`}
                          size="small"
                          color="primary"
                        />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <Card variant="outlined" sx={{ height: "fit-content" }}>
          <CardContent>
            <Typography variant="h6">Current sale</Typography>
            {cart.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No items yet. Tap a product to add it.
              </Typography>
            ) : (
              <>
                <Box sx={{ mt: 1 }}>
                  {cart.map((line) => (
                    <Box
                      key={line.product._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        py: 1,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {line.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(line.product.price)} each
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => changeQuantity(line.product._id, -1)}
                        aria-label={`Decrease quantity of ${line.product.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{ minWidth: 20, textAlign: "center" }}
                        className="tabular-nums"
                      >
                        {line.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => changeQuantity(line.product._id, 1)}
                        aria-label={`Increase quantity of ${line.product.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ minWidth: 64, textAlign: "right" }}
                        className="tabular-nums"
                      >
                        {formatPrice(
                          (Number(line.product.price) || 0) * line.quantity
                        )}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(line.product._id)}
                        aria-label={`Remove ${line.product.name} from sale`}
                      >
                        <Trash className="h-4 w-4" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Total
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    className="tabular-nums"
                  >
                    {formatPrice(total)}
                  </Typography>
                </Box>
                <ToggleButtonGroup
                  value={paymentMethod}
                  exclusive
                  onChange={(_, value) => value && setPaymentMethod(value)}
                  fullWidth
                  sx={{ mt: 2 }}
                  aria-label="Payment method"
                >
                  <ToggleButton value="cash" aria-label="Cash payment">
                    <Banknote className="mr-2 h-4 w-4" />
                    Cash
                  </ToggleButton>
                  <ToggleButton value="card" aria-label="Card payment">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  The payment method is recorded only — no payment is
                  processed.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleCompleteSale}
                  disabled={isCompleting || cart.length === 0}
                >
                  {isCompleting ? "Completing..." : "Complete sale"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POS;
