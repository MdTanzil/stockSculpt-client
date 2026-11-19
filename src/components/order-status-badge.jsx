/* eslint-disable react/prop-types */
import Chip from "@mui/material/Chip";

const OrderStatusBadge = ({ status }) => {
  const value = (status || "pending").toLowerCase();
  const label = value.charAt(0).toUpperCase() + value.slice(1);

  if (value === "completed") {
    return (
      <Chip
        label={label}
        size="small"
        sx={{ backgroundColor: "#d1fae5", color: "#065f46", fontWeight: 500 }}
      />
    );
  }

  if (value === "canceled") {
    return <Chip label={label} size="small" color="error" sx={{ fontWeight: 500 }} />;
  }

  return <Chip label={label} size="small" sx={{ fontWeight: 500 }} />;
};

export default OrderStatusBadge;
