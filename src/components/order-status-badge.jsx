/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";

const OrderStatusBadge = ({ status }) => {
  const value = (status || "pending").toLowerCase();
  const label = value.charAt(0).toUpperCase() + value.slice(1);

  if (value === "completed") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
      >
        {label}
      </Badge>
    );
  }

  if (value === "canceled") {
    return <Badge variant="destructive">{label}</Badge>;
  }

  return <Badge variant="secondary">{label}</Badge>;
};

export default OrderStatusBadge;
