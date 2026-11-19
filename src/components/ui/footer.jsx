import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{ py: 2, backgroundColor: "#445760", color: "white", zIndex: 10 }}
    >
      <Typography
        variant="body1"
        align="center"
        sx={{ lineHeight: 1.5, fontWeight: 300 }}
      >
        © {new Date().getFullYear()} StockSculpt | All rights reserved.
      </Typography>
    </Box>
  );
}
