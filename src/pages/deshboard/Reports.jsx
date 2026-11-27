/* eslint-disable react/prop-types */
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import exportCsv from "@/utils/exportCsv";
import formatDate from "@/utils/formatDate";
import generateReportPdf from "@/utils/generateReportPdf";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const headerCellSx = {
  textTransform: "uppercase",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
};

const zebraRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
};

const formatMoney = (value) => `$${(Number(value) || 0).toFixed(2)}`;

// One report section: heading, CSV/PDF export buttons, a MUI table and an
// optional footer row. Export handlers are passed in by the parent so each
// section exports its own data.
const ReportSection = ({
  title,
  subtitle,
  onExportCsv,
  onExportPdf,
  children,
}) => (
  <Paper variant="outlined" sx={{ p: 2 }}>
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
    >
      <Box>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileSpreadsheet size={16} />}
          onClick={onExportCsv}
        >
          CSV
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileText size={16} />}
          onClick={onExportPdf}
        >
          PDF
        </Button>
      </Stack>
    </Stack>
    <Box sx={{ mt: 2 }}>{children}</Box>
  </Paper>
);

const Reports = () => {
  const axiosSecure = useAxiosSecure();
  const { shop } = useShop();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const rangeParams = useMemo(() => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return params;
  }, [from, to]);

  // Human-readable range label used in exports and section subtitles.
  const rangeLabel = useMemo(() => {
    if (from && to) return `${formatDate(from)} – ${formatDate(to)}`;
    if (from) return `From ${formatDate(from)}`;
    if (to) return `Until ${formatDate(to)}`;
    return "All time";
  }, [from, to]);

  const summaryQuery = useQuery({
    queryKey: ["reports-summary", from, to],
    queryFn: async () =>
      (await axiosSecure.get("/reports/summary", { params: rangeParams }))
        .data,
  });
  const productQuery = useQuery({
    queryKey: ["reports-sales-by-product", from, to],
    queryFn: async () =>
      (
        await axiosSecure.get("/reports/sales-by-product", {
          params: rangeParams,
        })
      ).data,
  });
  const categoryQuery = useQuery({
    queryKey: ["reports-sales-by-category", from, to],
    queryFn: async () =>
      (
        await axiosSecure.get("/reports/sales-by-category", {
          params: rangeParams,
        })
      ).data,
  });
  const monthlyQuery = useQuery({
    queryKey: ["reports-sales-by-month", from, to],
    queryFn: async () =>
      (
        await axiosSecure.get("/reports/sales-by-month", {
          params: rangeParams,
        })
      ).data,
  });
  const inventoryQuery = useQuery({
    queryKey: ["reports-inventory"],
    queryFn: async () => (await axiosSecure.get("/reports/inventory")).data,
  });

  const summary = summaryQuery.data || {};
  const salesByProduct = productQuery.data || [];
  const salesByCategory = categoryQuery.data || [];
  const salesByMonth = monthlyQuery.data || [];
  const inventory = inventoryQuery.data || { items: [], totals: {} };

  // Best sellers = top 5 by revenue (the list is already revenue-sorted);
  // slow movers = the 5 lowest, including products with no sales at all.
  const bestSellers = salesByProduct.slice(0, 5);
  const slowMovers = [...salesByProduct]
    .sort((a, b) => a.revenue - b.revenue || a.unitsSold - b.unitsSold)
    .slice(0, 5);

  const isLoading =
    summaryQuery.isLoading ||
    productQuery.isLoading ||
    categoryQuery.isLoading ||
    monthlyQuery.isLoading ||
    inventoryQuery.isLoading;
  const isError =
    summaryQuery.isError ||
    productQuery.isError ||
    categoryQuery.isError ||
    monthlyQuery.isError ||
    inventoryQuery.isError;

  const exporters = {
    productCsv: () => {
      exportCsv(
        "sales-by-product.csv",
        ["Product", "Category", "Units sold", "Revenue"],
        salesByProduct.map((row) => [
          row.name,
          row.category,
          row.unitsSold,
          row.revenue.toFixed(2),
        ])
      );
      toast.success("Sales by product exported as CSV.");
    },
    productPdf: () => {
      generateReportPdf({
        title: "Sales by Product",
        subtitle: rangeLabel,
        shopName: shop?.name,
        headers: ["Product", "Category", "Units sold", "Revenue"],
        rows: salesByProduct.map((row) => [
          row.name,
          row.category,
          row.unitsSold,
          formatMoney(row.revenue),
        ]),
        filename: "sales-by-product.pdf",
        footer: `Total revenue: ${formatMoney(summary.totalRevenue)}`,
      });
      toast.success("Sales by product exported as PDF.");
    },
    categoryCsv: () => {
      exportCsv(
        "sales-by-category.csv",
        ["Category", "Products", "Units sold", "Revenue"],
        salesByCategory.map((row) => [
          row.category,
          row.productCount,
          row.unitsSold,
          row.revenue.toFixed(2),
        ])
      );
      toast.success("Sales by category exported as CSV.");
    },
    categoryPdf: () => {
      generateReportPdf({
        title: "Sales by Category",
        subtitle: rangeLabel,
        shopName: shop?.name,
        headers: ["Category", "Products", "Units sold", "Revenue"],
        rows: salesByCategory.map((row) => [
          row.category,
          row.productCount,
          row.unitsSold,
          formatMoney(row.revenue),
        ]),
        filename: "sales-by-category.pdf",
        footer: `Total revenue: ${formatMoney(summary.totalRevenue)}`,
      });
      toast.success("Sales by category exported as PDF.");
    },
    monthlyCsv: () => {
      exportCsv(
        "monthly-sales.csv",
        ["Month", "Orders", "Units sold", "Revenue"],
        salesByMonth.map((row) => [
          row.label,
          row.orders,
          row.unitsSold,
          row.revenue.toFixed(2),
        ])
      );
      toast.success("Monthly sales exported as CSV.");
    },
    monthlyPdf: () => {
      generateReportPdf({
        title: "Monthly Sales",
        subtitle: rangeLabel,
        shopName: shop?.name,
        headers: ["Month", "Orders", "Units sold", "Revenue"],
        rows: salesByMonth.map((row) => [
          row.label,
          row.orders,
          row.unitsSold,
          formatMoney(row.revenue),
        ]),
        filename: "monthly-sales.pdf",
        footer: `Total revenue: ${formatMoney(summary.totalRevenue)}`,
      });
      toast.success("Monthly sales exported as PDF.");
    },
    inventoryCsv: () => {
      exportCsv(
        "inventory-valuation.csv",
        ["Product", "Category", "Stock", "Unit price", "Stock value", "Status"],
        inventory.items.map((row) => [
          row.name,
          row.category,
          row.stock,
          Number(row.price).toFixed(2),
          row.value.toFixed(2),
          row.status === "out"
            ? "Out of stock"
            : row.status === "low"
              ? "Low stock"
              : "In stock",
        ])
      );
      toast.success("Inventory valuation exported as CSV.");
    },
    inventoryPdf: () => {
      generateReportPdf({
        title: "Inventory Valuation",
        subtitle: "Current stock",
        shopName: shop?.name,
        headers: ["Product", "Category", "Stock", "Unit price", "Value"],
        rows: inventory.items.map((row) => [
          row.name,
          row.category,
          row.stock,
          formatMoney(row.price),
          formatMoney(row.value),
        ]),
        filename: "inventory-valuation.pdf",
        footer: `Total stock value: ${formatMoney(inventory.totals.totalValue)}`,
      });
      toast.success("Inventory valuation exported as PDF.");
    },
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Typography variant="h6" color="text.secondary">
          Loading reports...
        </Typography>
      </div>
    );
  }

  const stats = [
    {
      title: "Revenue",
      value: formatMoney(summary.totalRevenue),
      icon: DollarSign,
      hint: "Completed orders",
    },
    {
      title: "Total Orders",
      value: summary.totalOrders ?? 0,
      icon: ShoppingCart,
      hint: `${summary.completedOrders ?? 0} completed · ${
        summary.pendingOrders ?? 0
      } pending · ${summary.canceledOrders ?? 0} canceled`,
    },
    {
      title: "Avg. Order Value",
      value: formatMoney(summary.averageOrderValue),
      icon: TrendingUp,
      hint: "Completed orders",
    },
    {
      title: "Units Sold",
      value: summary.totalUnitsSold ?? 0,
      icon: Boxes,
      hint: "Completed orders",
    },
    {
      title: "Stock Value",
      value: formatMoney(summary.totalStockValue),
      icon: Package,
      hint: `${summary.totalProducts ?? 0} products · current`,
    },
    {
      title: "Low Stock Items",
      value: summary.lowStockCount ?? 0,
      icon: AlertTriangle,
      hint: "At or below each product's own threshold · current",
    },
  ];

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          Reports
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Sales, inventory and performance — export any table as CSV or PDF.
        </Typography>
      </div>

      {isError ? (
        <Alert severity="error">
          Could not load the reports. Please try again.
        </Alert>
      ) : null}

      {/* Date range filter — applies to the sales reports only. */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "flex-end" }}
        >
          <TextField
            label="From"
            type="date"
            size="small"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button
            variant="outlined"
            size="small"
            disabled={!from && !to}
            onClick={() => {
              setFrom("");
              setTo("");
            }}
          >
            Clear range
          </Button>
          <Typography variant="body2" color="text.secondary">
            Date range applies to sales reports only. Inventory is always
            current.
          </Typography>
        </Stack>
      </Paper>

      {/* Summary cards */}
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid key={stat.title} item xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  color="text.secondary"
                >
                  <stat.icon size={20} />
                  <Typography variant="subtitle2">{stat.title}</Typography>
                </Stack>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.hint}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sales by product */}
      <ReportSection
        title="Sales by Product"
        subtitle={`Completed orders · ${rangeLabel}. Revenue uses current product prices.`}
        onExportCsv={exporters.productCsv}
        onExportPdf={exporters.productPdf}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Product</TableCell>
                <TableCell sx={headerCellSx}>Category</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Units sold
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Revenue
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesByProduct.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No sales in this range.
                  </TableCell>
                </TableRow>
              ) : (
                salesByProduct.map((row) => (
                  <TableRow key={row.productId} sx={zebraRowSx}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.unitsSold}</TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatMoney(row.revenue)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: 700 }}>
                  {salesByProduct.length} products
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total {formatMoney(summary.totalRevenue)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ReportSection>

      {/* Sales by category */}
      <ReportSection
        title="Sales by Category"
        subtitle={`Completed orders · ${rangeLabel}`}
        onExportCsv={exporters.categoryCsv}
        onExportPdf={exporters.categoryPdf}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Category</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Products
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Units sold
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Revenue
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesByCategory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No sales in this range.
                  </TableCell>
                </TableRow>
              ) : (
                salesByCategory.map((row) => (
                  <TableRow key={row.category} sx={zebraRowSx}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.productCount}</TableCell>
                    <TableCell align="right">{row.unitsSold}</TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatMoney(row.revenue)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: 700 }}>
                  {salesByCategory.length} categories
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total {formatMoney(summary.totalRevenue)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ReportSection>

      {/* Monthly sales */}
      <ReportSection
        title="Monthly Sales"
        subtitle={`Completed orders · ${rangeLabel}`}
        onExportCsv={exporters.monthlyCsv}
        onExportPdf={exporters.monthlyPdf}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Month</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Orders
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Units sold
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Revenue
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesByMonth.map((row) => (
                <TableRow key={row.month} sx={zebraRowSx}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell align="right">{row.orders}</TableCell>
                  <TableCell align="right">{row.unitsSold}</TableCell>
                  <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatMoney(row.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: 700 }}>
                  {salesByMonth.length} months
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total {formatMoney(summary.totalRevenue)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ReportSection>

      {/* Best sellers + slow movers */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={700}>
              Best Sellers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Top 5 products by revenue · {rangeLabel}
            </Typography>
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerCellSx}>Product</TableCell>
                    <TableCell sx={headerCellSx} align="right">
                      Units
                    </TableCell>
                    <TableCell sx={headerCellSx} align="right">
                      Revenue
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestSellers.map((row) => (
                    <TableRow key={row.productId} sx={zebraRowSx}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.unitsSold}</TableCell>
                      <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {formatMoney(row.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" fontWeight={700}>
              Slow Movers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              5 lowest products by revenue · {rangeLabel}
            </Typography>
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerCellSx}>Product</TableCell>
                    <TableCell sx={headerCellSx} align="right">
                      Units
                    </TableCell>
                    <TableCell sx={headerCellSx} align="right">
                      Revenue
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slowMovers.map((row) => (
                    <TableRow key={row.productId} sx={zebraRowSx}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.unitsSold}</TableCell>
                      <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                        {formatMoney(row.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Inventory valuation */}
      <ReportSection
        title="Inventory Valuation"
        subtitle="Current stock, valued at current prices"
        onExportCsv={exporters.inventoryCsv}
        onExportPdf={exporters.inventoryPdf}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Product</TableCell>
                <TableCell sx={headerCellSx}>Category</TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Stock
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Unit price
                </TableCell>
                <TableCell sx={headerCellSx} align="right">
                  Stock value
                </TableCell>
                <TableCell sx={headerCellSx}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No products yet.
                  </TableCell>
                </TableRow>
              ) : (
                inventory.items.map((row) => (
                  <TableRow key={row.productId} sx={zebraRowSx}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.stock}</TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatMoney(row.price)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatMoney(row.value)}
                    </TableCell>
                    <TableCell>
                      {row.status === "out" ? (
                        <Chip label="Out of stock" color="error" size="small" />
                      ) : row.status === "low" ? (
                        <Chip label="Low stock" color="warning" size="small" />
                      ) : (
                        <Chip label="In stock" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} sx={{ fontWeight: 700 }}>
                  {inventory.totals.productCount ?? 0} products ·{" "}
                  {inventory.totals.totalUnits ?? 0} units ·{" "}
                  {inventory.totals.lowCount ?? 0} low ·{" "}
                  {inventory.totals.outCount ?? 0} out of stock
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Total {formatMoney(inventory.totals.totalValue)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ReportSection>
    </div>
  );
};

export default Reports;
