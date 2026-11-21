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
  effectivePrice,
  hasDiscount,
  orderSavings,
} from "@/utils/productPrice";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Banknote,
  Barcode,
  Camera,
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
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const shortId = (id) => `#${String(id || "").slice(-6).toUpperCase()}`;

const POS = () => {
  const axiosSecure = useAxiosSecure();
  const {
    shop,
    shopLoading,
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
  // Barcode scanning into the cart: a typed/pasted code, a USB wedge
  // scanner (it types the code + Enter), or the camera.
  const [barcode, setBarcode] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const scannerRef = useRef(null);
  const barcodeRef = useRef(null);
  // The same code scanned twice within 2s is one scan — the camera
  // keeps seeing the same barcode while it stays in view.
  const lastScanRef = useRef(null);
  // The camera callback outlives renders, so it calls the latest
  // addScannedCode through this ref instead of a stale closure.
  const addScannedCodeRef = useRef(null);
  // Draft text for the quantity field on each cart line, keyed by
  // product id. Typing updates the draft; blur or Enter commits it.
  const [qtyDrafts, setQtyDrafts] = useState({});

  // Stop the camera when leaving the page.
  useEffect(
    () => () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    },
    []
  );

  // While the shop is still loading, show placeholders — not the
  // "no shop yet" message (that flashed wrongly on first load).
  if (shopLoading) {
    return (
      <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
        <Skeleton variant="rounded" height={64} />
      </Box>
    );
  }

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

  // Search matches the product name or its barcode, so staff can find
  // a product either way.
  const filteredProducts = (products || []).filter((product) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      product.name.toLowerCase().includes(q) ||
      (product.barcode || "").toLowerCase().includes(q)
    );
  });

  const cartQuantity = (productId) =>
    cart.find((line) => line.product._id === productId)?.quantity || 0;

  // Drop the typed-quantity draft for a line whose quantity just
  // changed another way (tap, scan, stepper) so the draft cannot mask
  // the new quantity.
  const clearQtyDraft = (productId) =>
    setQtyDrafts((prev) => {
      if (!(productId in prev)) return prev;
      const next = { ...prev };
      delete next[productId];
      return next;
    });

  // Adds one unit. Returns false when the stock cap blocks the add.
  const addToCart = (product) => {
    const stock = Number(product.stock) || 0;
    const inCart = cartQuantity(product._id);
    if (inCart >= stock) {
      toast.error(
        stock === 0
          ? `${product.name} is out of stock.`
          : `Only ${stock} ${product.name} in stock.`
      );
      return false;
    }
    clearQtyDraft(product._id);
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
    return true;
  };

  const changeQuantity = (productId, delta) => {
    clearQtyDraft(productId);
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

  // Commit a typed quantity (blur or Enter): whole numbers only,
  // clamped to stock. An empty or invalid value leaves the line as is.
  const commitQuantity = (productId) => {
    const raw = qtyDrafts[productId];
    if (raw === undefined) return;
    const value = Math.floor(Number(raw));
    setCart((prev) =>
      prev.map((line) => {
        if (line.product._id !== productId) return line;
        const stock = Number(line.product.stock) || 0;
        if (!Number.isFinite(value) || value < 1) return line;
        if (value > stock) {
          toast.error(`Only ${stock} ${line.product.name} in stock.`);
          return { ...line, quantity: stock };
        }
        return { ...line, quantity: value };
      })
    );
    clearQtyDraft(productId);
  };

  const removeFromCart = (productId) => {
    clearQtyDraft(productId);
    setCart((prev) => prev.filter((line) => line.product._id !== productId));
  };

  // Look a barcode up and add the product to the sale (one more unit
  // if it is already in the cart).
  const addScannedCode = async (rawCode) => {
    const code = String(rawCode || "").trim();
    if (!code) return;
    try {
      const res = await axiosSecure.get(
        `/products/barcode/${encodeURIComponent(code)}`
      );
      if (addToCart(res.data)) {
        toast.success(`${res.data.name} added to sale.`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error(`No product with barcode ${code}.`);
      } else {
        toast.error(error.response?.data?.error || "Barcode lookup failed.");
      }
    }
  };
  // Keep the camera callback on the latest handler (it outlives renders).
  addScannedCodeRef.current = addScannedCode;

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch {
        // Already stopped.
      }
      scannerRef.current = null;
    }
    setCameraOn(false);
  };

  // The camera keeps running after a successful scan so staff can scan
  // item after item; the 2s same-code guard stops one barcode from
  // adding itself over and over while it stays in view.
  const startCamera = () => {
    setCameraOn(true);
    // Create the scanner after React has rendered the reader div.
    setTimeout(() => {
      if (scannerRef.current) return;
      const scanner = new Html5QrcodeScanner(
        "pos-barcode-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose */ false
      );
      scannerRef.current = scanner;
      scanner.render(
        (decodedText) => {
          const now = Date.now();
          const last = lastScanRef.current;
          if (last && last.code === decodedText && now - last.at < 2000) {
            return;
          }
          lastScanRef.current = { code: decodedText, at: now };
          addScannedCodeRef.current?.(decodedText);
        },
        // Called for every frame without a readable code — ignore.
        () => {}
      );
    }, 0);
  };

  // Manual barcode entry (also how a USB wedge scanner submits: it
  // types the code and presses Enter). The field clears and keeps
  // focus so the next code can be scanned straight away.
  const handleBarcodeSubmit = (event) => {
    event.preventDefault();
    addScannedCode(barcode);
    setBarcode("");
    barcodeRef.current?.focus();
  };

  const total = cart.reduce(
    (sum, line) => sum + effectivePrice(line.product) * line.quantity,
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
                      effectivePrice(item.product) * item.quantity
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
              {orderSavings(sale.products) > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={600}
                  >
                    You saved
                  </Typography>
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight={700}
                    className="tabular-nums"
                  >
                    {formatPrice(orderSavings(sale.products))}
                  </Typography>
                </Box>
              )}
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
        Tap a product, or scan its barcode, to add it to the sale. Stock
        is decremented when the sale completes.
      </Typography>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <form
                onSubmit={handleBarcodeSubmit}
                className="flex flex-wrap items-end gap-2"
              >
                <TextField
                  label="Scan or type a barcode"
                  inputRef={barcodeRef}
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="Scan a barcode to add it to the sale"
                  sx={{ flexGrow: 1, minWidth: 200 }}
                  slotProps={{
                    input: {
                      startAdornment: <Barcode className="mr-2 h-5 w-5" />,
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!barcode.trim()}
                  endIcon={<Plus className="h-4 w-4" />}
                >
                  Add
                </Button>
              </form>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                A USB barcode scanner types the code for you — press Enter
                to add. Scanning a product already in the sale adds one
                more.
              </Typography>
              {cameraOn ? (
                <Box sx={{ mt: 2 }}>
                  <div id="pos-barcode-reader" />
                  <Button
                    variant="outlined"
                    onClick={stopCamera}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Stop camera
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  onClick={startCamera}
                  endIcon={<Camera className="h-4 w-4" />}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Scan with camera
                </Button>
              )}
            </CardContent>
          </Card>
          <TextField
            fullWidth
            label="Search by name or barcode"
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
                          {formatPrice(effectivePrice(product))}{" "}
                          {hasDiscount(product) && (
                            <span
                              style={{ textDecoration: "line-through" }}
                            >
                              {formatPrice(product.price)}
                            </span>
                          )}{" "}
                          · {stock} in stock
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
                          {formatPrice(effectivePrice(line.product))} each{" "}
                          {hasDiscount(line.product) && (
                            <span
                              style={{ textDecoration: "line-through" }}
                            >
                              {formatPrice(line.product.price)}
                            </span>
                          )}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => changeQuantity(line.product._id, -1)}
                        aria-label={`Decrease quantity of ${line.product.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </IconButton>
                      <TextField
                        type="number"
                        size="small"
                        value={
                          qtyDrafts[line.product._id] ?? line.quantity
                        }
                        onChange={(e) =>
                          setQtyDrafts((prev) => ({
                            ...prev,
                            [line.product._id]: e.target.value,
                          }))
                        }
                        onBlur={() => commitQuantity(line.product._id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitQuantity(line.product._id);
                            e.currentTarget.blur();
                          }
                        }}
                        sx={{ width: 72 }}
                        slotProps={{
                          input: {
                            inputProps: {
                              min: 1,
                              max: Number(line.product.stock) || 1,
                              "aria-label": `Quantity of ${line.product.name}`,
                            },
                          },
                        }}
                      />
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
                          effectivePrice(line.product) * line.quantity
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
