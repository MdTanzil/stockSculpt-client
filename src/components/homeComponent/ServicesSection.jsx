import {
  Box,
  Card,
  CardContent,
  Container,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import {
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Store,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      icon: Store,
      title: "Store Setup",
      text: "Create your own shop with a name, logo and address, and manage everything from a single dashboard.",
    },
    {
      icon: Boxes,
      title: "Inventory Management",
      text: "Add products with images, prices, categories and stock quantities. Update or remove them any time.",
    },
    {
      icon: ClipboardList,
      title: "Order Management",
      text: "Build orders from your stock, set quantities and status, and keep every order organised and searchable.",
    },
    {
      icon: LayoutDashboard,
      title: "Dashboard Overview",
      text: "Totals for products, orders and revenue, plus low-stock alerts, all on one simple dashboard home.",
    },
    {
      icon: FileText,
      title: "Invoices & Checkout",
      text: "Download a clean PDF invoice for any order, with item lines and the total amount, ready to share.",
    },
    {
      icon: TrendingUp,
      title: "Growth Plans",
      text: "Start free and upgrade when your shop grows, with higher product limits on paid subscription plans.",
    },
  ];

  return (
    <Box component="section" sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ mx: "auto", maxWidth: "48rem", textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={600}
            color="primary"
            sx={{ fontSize: { lg: "2.25rem" } }}
          >
            What stockSculpt does for your shop
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 2, fontSize: { lg: "1.125rem" } }}
          >
            Everything a small shop needs to run its inventory, orders and
            sales in one place.
          </Typography>
        </Box>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} variant="outlined">
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ color: "primary.main", display: "flex" }}>
                  <service.icon size={32} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {service.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          <MuiLink
            component={Link}
            to="/services"
            color="primary"
            fontWeight={600}
            underline="hover"
          >
            View all services &rarr;
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesSection;
