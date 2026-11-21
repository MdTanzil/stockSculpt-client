import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Barcode,
  Camera,
  Minus,
  PackageSearch,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const Scan = () => {
  const axiosSecure = useAxiosSecure();
  const { shop, refetch, canEdit } = useShop();
  const scannerRef = useRef(null);

  const [code, setCode] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  // idle | looking | found | not-found | error
  const [status, setStatus] = useState("idle");
  const [searchedCode, setSearchedCode] = useState("");
  const [product, setProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);
  // Quick-add form (shown when a scanned code matches no product).
  const [quickName, setQuickName] = useState("");
  const [quickPrice, setQuickPrice] = useState("");
  const [quickStock, setQuickStock] = useState("");
  const [quickCategory, setQuickCategory] = useState("Electronics");
  const [isSaving, setIsSaving] = useState(false);

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

  if (!shop?._id) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        You do not have a shop yet. Create one to scan products.
      </Typography>
    );
  }

  const lookup = async (rawCode) => {
    const trimmed = String(rawCode || "").trim();
    if (!trimmed) return;
    setSearchedCode(trimmed);
    setStatus("looking");
    try {
      const res = await axiosSecure.get(
        `/products/barcode/${encodeURIComponent(trimmed)}`
      );
      setProduct(res.data);
      setNewStock(Number(res.data.stock) || 0);
      setStatus("found");
    } catch (error) {
      if (error.response?.status === 404) {
        setProduct(null);
        setStatus("not-found");
      } else {
        setStatus("error");
        toast.error(error.response?.data?.error || "Lookup failed.");
      }
    }
  };

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

  const startCamera = () => {
    setCameraOn(true);
    // Create the scanner after React has rendered the reader div.
    setTimeout(() => {
      if (scannerRef.current) return;
      const scanner = new Html5QrcodeScanner(
        "barcode-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose */ false
      );
      scannerRef.current = scanner;
      scanner.render(
        (decodedText) => {
          stopCamera();
          lookup(decodedText);
        },
        // Called for every frame without a readable code — ignore.
        () => {}
      );
    }, 0);
  };

  const handleManualLookup = (event) => {
    event.preventDefault();
    lookup(code);
  };

  const handleUpdateStock = async () => {
    if (!product) return;
    setIsSaving(true);
    try {
      const res = await axiosSecure.put(`/products/${product._id}`, {
        stock: newStock,
      });
      setProduct(res.data);
      toast.success("Stock updated.");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update stock.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickAdd = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const res = await axiosSecure.post("/products", {
        name: quickName.trim(),
        price: Number(quickPrice),
        stock: Number(quickStock),
        category: quickCategory,
        barcode: searchedCode,
      });
      setProduct(res.data);
      setNewStock(Number(res.data.stock) || 0);
      setStatus("found");
      toast.success("Product added.");
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanAnother = () => {
    setCode("");
    setStatus("idle");
    setProduct(null);
    setSearchedCode("");
    setQuickName("");
    setQuickPrice("");
    setQuickStock("");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Typography variant="h4" align="center" fontWeight={700} color="primary.main">
        Scan a Barcode
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 1 }}
      >
        Scan a product&apos;s barcode with your camera, or type it in — a USB
        barcode scanner works too, it types the code for you.
      </Typography>

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <form
            onSubmit={handleManualLookup}
            className="flex flex-wrap items-end gap-2"
          >
            <TextField
              label="Barcode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 8901030895486"
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
              disabled={!code.trim()}
              endIcon={<Search className="h-4 w-4" />}
            >
              Look up
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          {cameraOn ? (
            <>
              <div id="barcode-reader" />
              <Button
                variant="outlined"
                onClick={stopCamera}
                sx={{ mt: 2 }}
                fullWidth
              >
                Stop camera
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                Point your phone or laptop camera at a barcode or QR code.
                Your browser will ask for camera permission.
              </Typography>
              <Button
                variant="contained"
                onClick={startCamera}
                endIcon={<Camera className="h-4 w-4" />}
                sx={{ mt: 2 }}
                fullWidth
              >
                Start camera scanning
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }}>
        {status === "looking" ? (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Skeleton variant="rounded" height={72} />
          </Paper>
        ) : null}

        {status === "error" ? (
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">Something went wrong</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              The lookup failed. Check your connection and try again.
            </Typography>
            <Button variant="outlined" onClick={handleScanAnother} sx={{ mt: 2 }}>
              Try again
            </Button>
          </Paper>
        ) : null}

        {status === "found" && product ? (
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={product.image}
                  alt={product.name}
                  variant="rounded"
                  sx={{ width: 56, height: 56 }}
                >
                  {product.name?.charAt(0)?.toUpperCase() || "P"}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(product.price)}
                    {product.category ? ` · ${product.category}` : ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {product.barcode}
                  </Typography>
                </Box>
                <Typography variant="h6" className="tabular-nums">
                  {product.stock} in stock
                </Typography>
              </Box>

              {canEdit ? (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    Adjust stock:
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setNewStock((s) => Math.max(0, s - 1))}
                    aria-label="Decrease stock"
                  >
                    <Minus className="h-4 w-4" />
                  </IconButton>
                  <TextField
                    type="number"
                    size="small"
                    value={newStock}
                    onChange={(e) =>
                      setNewStock(Math.max(0, Number(e.target.value) || 0))
                    }
                    sx={{ width: 90 }}
                    slotProps={{ input: { inputProps: { min: 0 } } }}
                    aria-label="New stock quantity"
                  />
                  <IconButton
                    size="small"
                    onClick={() => setNewStock((s) => s + 1)}
                    aria-label="Increase stock"
                  >
                    <Plus className="h-4 w-4" />
                  </IconButton>
                  <Button
                    variant="contained"
                    onClick={handleUpdateStock}
                    disabled={
                      isSaving || newStock === (Number(product.stock) || 0)
                    }
                  >
                    {isSaving ? "Saving..." : "Update stock"}
                  </Button>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 3 }}
                >
                  You can look up products, but only staff and above can
                  change stock.
                </Typography>
              )}

              <Button
                variant="outlined"
                onClick={handleScanAnother}
                sx={{ mt: 3 }}
                fullWidth
              >
                Scan another
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {status === "not-found" ? (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: "center" }}>
              <PackageSearch className="mx-auto h-10 w-10" />
              <Typography variant="h6" sx={{ mt: 1 }}>
                No product with this barcode
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: "monospace" }}
              >
                {searchedCode}
              </Typography>
              {canEdit ? (
                <form onSubmit={handleQuickAdd} className="mt-4 text-left">
                  <Typography variant="subtitle1" fontWeight={600}>
                    Add it as a new product
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                      },
                    }}
                  >
                    <TextField
                      label="Product name"
                      required
                      fullWidth
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      sx={{ gridColumn: { sm: "1 / -1" } }}
                    />
                    <TextField
                      label="Price ($)"
                      type="number"
                      required
                      fullWidth
                      value={quickPrice}
                      onChange={(e) => setQuickPrice(e.target.value)}
                      slotProps={{
                        input: { inputProps: { min: 0, step: "0.01" } },
                      }}
                    />
                    <TextField
                      label="Stock"
                      type="number"
                      required
                      fullWidth
                      value={quickStock}
                      onChange={(e) => setQuickStock(e.target.value)}
                      slotProps={{ input: { inputProps: { min: 0 } } }}
                    />
                    <FormControl fullWidth sx={{ gridColumn: { sm: "1 / -1" } }}>
                      <InputLabel id="quick-category-label">
                        Category
                      </InputLabel>
                      <Select
                        labelId="quick-category-label"
                        label="Category"
                        value={quickCategory}
                        onChange={(e) => setQuickCategory(e.target.value)}
                      >
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Clothing">Clothing</MenuItem>
                        <MenuItem value="Accessories">Accessories</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSaving}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {isSaving ? "Adding..." : "Add product with this barcode"}
                  </Button>
                </form>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Only staff and above can add products.
                </Typography>
              )}
              <Button
                variant="outlined"
                onClick={handleScanAnother}
                sx={{ mt: 2 }}
                fullWidth
              >
                Scan another
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </Box>
    </div>
  );
};

export default Scan;
