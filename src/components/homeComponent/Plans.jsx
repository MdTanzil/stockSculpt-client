import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Plans = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      limit: "Up to 3 products",
      text: "Try stockSculpt with your first products, no card needed.",
      buttonText: "Start free",
      to: "/register",
    },
    {
      name: "Starter",
      price: "$10",
      limit: "Up to 200 products",
      text: "For small shops getting organised.",
      buttonText: "Get started",
      to: "/subscription",
    },
    {
      name: "Company",
      price: "$20",
      limit: "Up to 450 products",
      text: "For growing shops with a bigger catalogue.",
      buttonText: "Get started",
      to: "/subscription",
    },
    {
      name: "Enterprise",
      price: "$50",
      limit: "Up to 1,500 products",
      text: "For large shops with a wide range.",
      buttonText: "Get started",
      to: "/subscription",
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
            Simple plans that grow with your shop
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 2, fontSize: { lg: "1.125rem" } }}
          >
            Start free. Upgrade when you need room for more products.
          </Typography>
        </Box>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant="outlined"
              sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  height: "100%",
                }}
              >
                <Typography variant="h5" component="h3" fontWeight={600}>
                  {plan.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, fontWeight: 300 }}>
                  {plan.text}
                </Typography>
                <Box
                  sx={{
                    my: 4,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h3" component="span" fontWeight="800">
                    {plan.price}
                  </Typography>
                </Box>
                <Box
                  component="ul"
                  sx={{
                    mb: 4,
                    listStyle: "none",
                    p: 0,
                    m: 0,
                    textAlign: "left",
                  }}
                >
                  <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Check size={20} color="#22c55e" style={{ flexShrink: 0 }} />
                    <span>{plan.limit}</span>
                  </Box>
                </Box>
                <Button
                  component={Link}
                  to={plan.to}
                  variant="contained"
                  sx={{ mt: "auto" }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default Plans;
