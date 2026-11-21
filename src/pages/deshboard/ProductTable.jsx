/* eslint-disable react/prop-types */
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Package, Pencil, SearchX, Star, Trash } from "lucide-react";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PR";

const formatPrice = (value) => `$${(Number(value) || 0).toFixed(2)}`;

const headerCellSx = {
  textTransform: "uppercase",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
};

const zebraRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
};

const getStockBadge = (stock) => {
  if (stock <= 0) return <Chip label="Out of stock" size="small" color="error" />;
  if (stock <= 5) {
    // Theme-aware warning chip (adapts to dark mode) instead of the
    // previous hardcoded light-amber colors.
    return (
      <Chip label={`Low: ${stock}`} size="small" color="warning" />
    );
  }
  return <span className="tabular-nums">{stock}</span>;
};

// Stock level bar: stock relative to 100, capped at 100. Same thresholds
// as the Low badge (red at 5 or fewer, amber at 20 or fewer).
const getStockBarColor = (stock) => {
  if (stock <= 5) return "error";
  if (stock <= 20) return "warning";
  return "success";
};

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  if (!products?.length) {
    if (hasActiveFilters) {
      return (
        <Paper variant="outlined" sx={{ py: 6, textAlign: "center" }}>
          <Box sx={{ color: "text.secondary", display: "flex", justifyContent: "center" }}>
            <SearchX className="h-10 w-10" />
          </Box>
          <Typography variant="h6" sx={{ mt: 2 }}>
            No products match your filters
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Try adjusting your search or filters.
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={onClearFilters}>
            Clear filters
          </Button>
        </Paper>
      );
    }
    return (
      <Paper variant="outlined" sx={{ py: 6, textAlign: "center" }}>
        <Box sx={{ color: "text.secondary", display: "flex", justifyContent: "center" }}>
          <Package className="h-10 w-10" />
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          No products yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Add your first product to start managing your inventory.
        </Typography>
      </Paper>
    );
  }

  const stockValue = products.reduce(
    (sum, product) =>
      sum + (Number(product.price) || 0) * (Number(product.stock) || 0),
    0
  );

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Image</TableCell>
            <TableCell sx={headerCellSx}>Name</TableCell>
            <TableCell sx={headerCellSx}>Description</TableCell>
            <TableCell sx={headerCellSx}>Category</TableCell>
            <TableCell sx={headerCellSx} align="right">
              Price
            </TableCell>
            <TableCell sx={headerCellSx} align="right">
              Rating
            </TableCell>
            <TableCell sx={headerCellSx} align="right">
              Stock
            </TableCell>
            <TableCell sx={headerCellSx} align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id} sx={zebraRowSx}>
              <TableCell>
                <Avatar
                  src={product.image}
                  alt={product.name}
                  variant="rounded"
                  sx={{ width: 40, height: 40 }}
                >
                  {getInitials(product.name)}
                </Avatar>
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
              <TableCell
                sx={{
                  maxWidth: 220,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "text.secondary",
                }}
              >
                {product.description}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell align="right" className="tabular-nums">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell align="right">
                {product.rating != null && product.rating !== "" ? (
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Star
                      className="h-4 w-4"
                      style={{ color: "#fbbf24", fill: "#fbbf24" }}
                    />
                    {Number(product.rating).toFixed(1)}
                  </span>
                ) : (
                  <Typography variant="body2" color="text.secondary" component="span">
                    —
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(Number(product.stock) || 0, 100)}
                    color={getStockBarColor(Number(product.stock) || 0)}
                    sx={{ width: 80, borderRadius: 1 }}
                  />
                  {getStockBadge(Number(product.stock) || 0)}
                </Box>
              </TableCell>
              <TableCell align="right">
                {!canEdit && !canDelete ? (
                  <Typography variant="body2" color="text.secondary">
                    —
                  </Typography>
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                    {canEdit ? (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                    ) : null}
                    {canDelete ? (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(product._id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash className="h-4 w-4" />
                      </IconButton>
                    ) : null}
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} sx={{ color: "text.secondary" }}>
              {totalCount != null && totalCount !== products.length
                ? `Showing ${products.length} of ${totalCount} products`
                : `${products.length} product${
                    products.length === 1 ? "" : "s"
                  }`}
            </TableCell>
            <TableCell colSpan={3} align="right" sx={{ fontWeight: 500 }}>
              Total stock value
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }} className="tabular-nums">
              {formatPrice(stockValue)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
