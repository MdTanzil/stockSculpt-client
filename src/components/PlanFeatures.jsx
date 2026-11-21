/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import { Check, X } from "lucide-react";

// The paid features — keep in sync with the server's requirePremium
// gating (middlewares/requirePremium.js) and the PremiumRouter guard.
// A plan whose feature list does not mention one of these shows it
// with a grey cross, so the pricing cards always tell the truth about
// the tiers instead of advertising paid features on the Free plan.
const PAID_FEATURES = [
  { label: "Point of sale (POS)", match: "point of sale" },
  { label: "Barcode scanning", match: "barcode" },
  { label: "Reports & export", match: "report" },
  { label: "Suppliers & purchase orders", match: "supplier" },
  { label: "Staff roles", match: "staff" },
];

// A plan card's feature list: every feature the plan includes gets a
// green tick; paid features it does not include get a grey cross.
const PlanFeatures = ({ features }) => {
  const included = features || [];
  const missing = PAID_FEATURES.filter(
    ({ match }) =>
      !included.some((feature) => feature.toLowerCase().includes(match))
  );

  return (
    <Box
      component="ul"
      role="list"
      sx={{
        mb: 4,
        listStyle: "none",
        p: 0,
        m: 0,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {included.map((feature) => (
        <Box
          component="li"
          key={feature}
          sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <Check size={20} color="#22c55e" style={{ flexShrink: 0 }} />
          <span>{feature}</span>
        </Box>
      ))}
      {missing.map(({ label }) => (
        <Box
          component="li"
          key={label}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "text.secondary",
          }}
        >
          <X size={20} style={{ flexShrink: 0 }} />
          <span>{label}</span>
        </Box>
      ))}
    </Box>
  );
};

export default PlanFeatures;
