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

const Subscription = () => {
  const plans = [
    {
      name: "Starter",
      price: 10,
      text: "Best option for personal use & for your next project.",
      limit: "Limit 200",
    },
    {
      name: "Company",
      price: 20,
      text: "Relevant for multiple users, extended & premium support.",
      limit: "Limit 450",
    },
    {
      name: "Enterprise",
      price: 50,
      text: "Best for large scale uses and extended redistribution rights.",
      limit: "Limit 1500",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, lg: 8 } }}>
        <Box sx={{ mx: "auto", maxWidth: "48rem", mb: { xs: 4, lg: 6 }, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="800"
            color="primary"
            sx={{ letterSpacing: "-0.025em" }}
          >
            Upgrade Your product limit
          </Typography>
        </Box>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant="outlined"
              sx={{ mx: "auto", maxWidth: "32rem", textAlign: "center" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  height: "100%",
                  "@media (min-width: 1280px)": { p: 4 },
                }}
              >
                <Typography variant="h5" component="h3" fontWeight={600} sx={{ mb: 2 }}>
                  {plan.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 300 }}>
                  {plan.text}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "baseline", my: 4 }}>
                  <Typography variant="h3" component="span" fontWeight="800">
                    ${plan.price}
                  </Typography>
                </Box>
                <Box
                  component="ul"
                  role="list"
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
                  to="/payment"
                  state={{ total: plan.price }}
                  variant="contained"
                  sx={{ mt: "auto" }}
                >
                  Get started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default Subscription;
