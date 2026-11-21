import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PlanFeatures from "../PlanFeatures";
import useAxiosPublic from "../../hooks/useAxiosPublic";

// Shown while the plans load, and if the server can't be reached — the
// live prices come from the same plans API the subscription page uses
// (the admin manages them), so a price change shows up here too. The
// fallback mirrors the seeded plans, Free with the core features only.
const FALLBACK_FEATURES_FREE = [
  "Up to 3 products",
  "Inventory & stock tracking",
  "Orders & invoicing",
  "Dashboard",
];
const FALLBACK_FEATURES_PAID = (limit) => [
  `Up to ${limit} products`,
  "Inventory & stock tracking",
  "Orders & invoicing",
  "Dashboard",
  "Point of sale (POS)",
  "Barcode scanning",
  "Reports & export",
  "Suppliers & purchase orders",
  "Staff roles",
];
const FALLBACK_PLANS = [
  {
    name: "Free",
    price: 0,
    limit: "Up to 3 products",
    text: "Try stockSculpt with your first products, no card needed.",
    features: FALLBACK_FEATURES_FREE,
    buttonText: "Start free",
    to: "/register",
  },
  {
    name: "Starter",
    price: 10,
    limit: "Up to 200 products",
    text: "For small shops getting organised.",
    features: FALLBACK_FEATURES_PAID("200"),
    buttonText: "Get started",
    to: "/subscription",
  },
  {
    name: "Company",
    price: 20,
    limit: "Up to 450 products",
    text: "For growing shops with a bigger catalogue.",
    features: FALLBACK_FEATURES_PAID("450"),
    buttonText: "Get started",
    to: "/subscription",
  },
  {
    name: "Enterprise",
    price: 50,
    limit: "Up to 1,500 products",
    text: "For large shops with a wide range.",
    features: FALLBACK_FEATURES_PAID("1,500"),
    buttonText: "Get started",
    to: "/subscription",
  },
];

const Plans = () => {
  const axiosPublic = useAxiosPublic();
  const { data: apiPlans, isPending } = useQuery({
    queryKey: ["plans-public"],
    queryFn: async () => {
      const res = await axiosPublic.get("/plans");
      return res.data;
    },
    // The home page must never break on a plans failure — fall back to
    // the built-in list instead of retrying loudly. No stale time: a
    // price or feature change the admin just saved shows up on the
    // next visit instead of lingering for minutes.
    retry: 1,
    staleTime: 0,
  });

  const plans =
    apiPlans && apiPlans.length > 0
      ? apiPlans.map((plan) => ({
          name: plan.name,
          price: plan.price,
          limit: `Up to ${plan.productLimit.toLocaleString()} products`,
          text: plan.description,
          features: plan.features?.length > 0 ? plan.features : null,
          popular: plan.popular,
          buttonText: plan.price === 0 ? "Start free" : "Get started",
          to: plan.price === 0 ? "/register" : "/subscription",
        }))
      : FALLBACK_PLANS;

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
            Start free with the core features. Upgrade for more products
            and the paid features.
          </Typography>
        </Box>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isPending
            ? [0, 1, 2, 3].map((key) => (
                <Skeleton key={key} variant="rounded" height={300} />
              ))
            : plans.map((plan) => (
            <Card
              key={plan.name}
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                position: "relative",
                ...(plan.popular && {
                  borderColor: "primary.main",
                  borderWidth: 2,
                  boxShadow: 3,
                }),
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most popular"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontWeight: 600,
                  }}
                />
              )}
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
                    ${Number.isInteger(plan.price) ? plan.price : plan.price.toFixed(2)}
                  </Typography>
                </Box>
                <PlanFeatures features={plan.features || [plan.limit]} />
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
