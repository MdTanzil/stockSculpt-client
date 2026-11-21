/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import useShop from "../hooks/useShop";
import { isPremium } from "../utils/subscriptionDates";

// Route guard for the paid features (point of sale, barcode scanning,
// reports, suppliers, purchase orders, staff roles). Free shops see an
// upgrade wall instead of the page; the server enforces the same rule,
// so this is presentation, not the security boundary. A user with no
// shop at all is passed through — the page itself shows its "create a
// shop" state instead of a misleading upgrade prompt.
const PremiumRouter = ({ children, feature }) => {
  const { shop, shopLoading } = useShop();

  if (shopLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!shop?._id || isPremium(shop)) {
    return children;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <Paper
        variant="outlined"
        sx={{ p: 4, maxWidth: 480, textAlign: "center" }}
      >
        <Lock style={{ margin: "0 auto", width: 40, height: 40 }} />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 700 }}>
          {feature || "This feature"} is available on paid plans
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your shop is on the Free plan. Upgrade to unlock it.
        </Typography>
        <Button
          component={Link}
          to="/subscription"
          variant="contained"
          sx={{ mt: 3 }}
        >
          View plans
        </Button>
      </Paper>
    </Box>
  );
};

export default PremiumRouter;
