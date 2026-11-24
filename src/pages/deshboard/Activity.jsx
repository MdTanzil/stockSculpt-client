import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useShop from "@/hooks/useShop";
import formatDateTime from "@/utils/formatDateTime";
import { useMemo, useState } from "react";

const PAGE_SIZE = 20;

const ENTITY_TYPES = [
  { value: "product", label: "Products" },
  { value: "order", label: "Orders" },
  { value: "supplier", label: "Suppliers" },
  { value: "purchase_order", label: "Purchase orders" },
  { value: "staff", label: "Staff" },
  { value: "shop", label: "Shop" },
];

// Every action the server records, grouped by what it acts on. Keep in
// sync with the logAudit calls in the server controllers.
const ACTIONS = {
  product: {
    "product.created": "Product added",
    "product.updated": "Product updated",
    "product.deleted": "Product deleted",
  },
  order: {
    "order.created": "Order created",
    "order.updated": "Order updated",
    "order.status_changed": "Order status changed",
    "order.deleted": "Order deleted",
    "pos.sale": "POS sale",
  },
  supplier: {
    "supplier.created": "Supplier added",
    "supplier.updated": "Supplier updated",
    "supplier.deleted": "Supplier deleted",
  },
  purchase_order: {
    "purchase_order.created": "Purchase order created",
    "purchase_order.updated": "Purchase order updated",
    "purchase_order.status_changed": "Purchase order status changed",
    "purchase_order.received": "Purchase order received",
    "purchase_order.deleted": "Purchase order deleted",
  },
  staff: {
    "staff.added": "Staff added",
    "staff.role_changed": "Staff role changed",
    "staff.removed": "Staff removed",
  },
  shop: {
    "shop.updated": "Shop updated",
    "shop.plan_changed": "Plan changed",
  },
};

const actionLabel = (action) => {
  for (const group of Object.values(ACTIONS)) {
    if (group[action]) return group[action];
  }
  return action;
};

// Green for things added/received/sold, red for deletions, neutral for
// updates and status changes.
const actionColor = (action) => {
  if (
    action.endsWith(".created") ||
    action.endsWith(".added") ||
    action.endsWith(".received") ||
    action === "pos.sale"
  ) {
    return "success";
  }
  if (action.endsWith(".deleted") || action.endsWith(".removed")) {
    return "error";
  }
  return "default";
};

const headerCellSx = {
  textTransform: "uppercase",
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.05em",
};

const zebraRowSx = {
  "&:nth-of-type(odd)": { backgroundColor: "action.hover" },
};

const Activity = () => {
  const axiosSecure = useAxiosSecure();
  const { shop, shopLoading } = useShop();
  const [entityType, setEntityType] = useState("all");
  const [action, setAction] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  // The action dropdown only offers actions for the chosen area; when
  // the area changes, the action filter resets.
  const actionOptions = useMemo(() => {
    if (entityType === "all") {
      return Object.entries(ACTIONS).flatMap(([, group]) =>
        Object.entries(group)
      );
    }
    return Object.entries(ACTIONS[entityType] || {});
  }, [entityType]);

  const queryParams = useMemo(() => {
    const params = { page, limit: PAGE_SIZE };
    if (entityType !== "all") params.entityType = entityType;
    if (action !== "all") params.action = action;
    if (from) params.from = from;
    if (to) params.to = to;
    return params;
  }, [entityType, action, from, to, page]);

  const {
    data = { logs: [], total: 0, pages: 1 },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["audit-logs", shop?._id, queryParams],
    queryFn: async () =>
      (
        await axiosSecure.get(`/shop/${shop._id}/audit-logs`, {
          params: queryParams,
        })
      ).data,
    enabled: Boolean(shop?._id),
  });

  const hasFilters =
    entityType !== "all" || action !== "all" || from !== "" || to !== "";

  const resetFilters = () => {
    setEntityType("all");
    setAction("all");
    setFrom("");
    setTo("");
    setPage(1);
  };

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
        You do not have a shop yet. Create one to see its activity.
      </Typography>
    );
  }

  const { logs, total, pages } = data;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Activity
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Who changed what in {shop.name} — products, orders, suppliers,
        purchase orders, staff and shop settings. Newest first.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ my: 2 }}
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="activity-area-label">Area</InputLabel>
          <Select
            labelId="activity-area-label"
            label="Area"
            value={entityType}
            onChange={(event) => {
              setEntityType(event.target.value);
              setAction("all");
              setPage(1);
            }}
          >
            <MenuItem value="all">All activity</MenuItem>
            {ENTITY_TYPES.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="activity-action-label">Action</InputLabel>
          <Select
            labelId="activity-action-label"
            label="Action"
            value={action}
            onChange={(event) => {
              setAction(event.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="all">All actions</MenuItem>
            {actionOptions.map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="From"
          type="date"
          size="small"
          value={from}
          onChange={(event) => {
            setFrom(event.target.value);
            setPage(1);
          }}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={to}
          onChange={(event) => {
            setTo(event.target.value);
            setPage(1);
          }}
          InputLabelProps={{ shrink: true }}
        />
        {hasFilters && (
          <Button variant="text" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </Stack>

      {isError ? (
        <Alert severity="error">
          Could not load the activity log. Please try again.
        </Alert>
      ) : isLoading ? (
        <Box sx={{ display: "grid", gap: 1 }}>
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={56} />
        </Box>
      ) : logs.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            {hasFilters ? "No activity matches these filters" : "No activity yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasFilters
              ? "Try a wider date range or a different area."
              : "Changes to products, orders, suppliers, purchase orders and staff will appear here."}
          </Typography>
          {hasFilters && (
            <Button sx={{ mt: 2 }} variant="outlined" onClick={resetFilters}>
              Clear filters
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>When</TableCell>
                  <TableCell sx={headerCellSx}>Who</TableCell>
                  <TableCell sx={headerCellSx}>Action</TableCell>
                  <TableCell sx={headerCellSx}>Item</TableCell>
                  <TableCell sx={headerCellSx}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id} sx={zebraRowSx}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {log.actor?.name || "—"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.actor?.email || ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={actionLabel(log.action)}
                        color={actionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{log.entityName || "—"}</TableCell>
                    <TableCell>{log.details || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {logs.length} of {total} entr
              {total === 1 ? "y" : "ies"}
            </Typography>
            {pages > 1 && (
              <Pagination
                count={pages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Activity;
