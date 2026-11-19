/* eslint-disable react/prop-types */
import Chip from "@mui/material/Chip";

const OrderStatusBadge = ({ status }) => {
  const value = (status || "pending").toLowerCase();
  const label = value.charAt(0).toUpperCase() + value.slice(1);

  if (value === "completed") {
    // Theme-aware success chip (adapts to dark mode) instead of the
    // previous hardcoded light-green colors.
    return (
      <Chip label={label} size="small" color="success" sx={{ fontWeight: 500 }} />
    );
  }

  if (value === "canceled") {
    return <Chip label={label} size="small" color="error" sx={{ fontWeight: 500 }} />;
  }

  return <Chip label={label} size="small" sx={{ fontWeight: 500 }} />;
};

export default OrderStatusBadge;
