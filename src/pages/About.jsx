import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { BarChart3, Box as BoxIcon, ShieldCheck, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const highlights = [
    {
      icon: BoxIcon,
      title: "Product Management",
      text: "Add, edit and organise every product in your shop with live stock levels, categories and pricing in one place.",
    },
    {
      icon: ShoppingCart,
      title: "Order Tracking",
      text: "Create orders from your own stock, follow them from pending to completed, and keep a clear record of every sale.",
    },
    {
      icon: BarChart3,
      title: "Shop Insights",
      text: "See total products, orders and revenue at a glance, with low-stock warnings so you never run out unnoticed.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      text: "Every shop belongs to its owner. Your products, orders and shop data are only visible to you and your admins.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mx: "auto", maxWidth: "48rem", textAlign: "center" }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          About StockSculpt
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, fontSize: "1.125rem" }}>
          StockSculpt is a simple inventory management system for small shops.
          It helps shop owners keep track of products, stock levels and orders
          without spreadsheets or paperwork.
        </Typography>
      </Box>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <Card key={item.title} variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ color: "primary.main", display: "flex" }}>
                <item.icon size={32} />
              </Box>
              <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {item.text}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Box
        sx={{
          mx: "auto",
          mt: 6,
          maxWidth: "48rem",
          borderRadius: 2,
          bgcolor: "primary.main",
          p: 4,
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          Ready to organise your shop?
        </Typography>
        <Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.8)" }}>
          Create your store account and start managing products and orders in
          minutes.
        </Typography>
        <Button
          component={Link}
          to="/create-store-account"
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 600,
            "&:hover": { bgcolor: "#f3f4f6" },
          }}
        >
          Create Your Store
        </Button>
      </Box>
    </Container>
  );
};

export default About;
