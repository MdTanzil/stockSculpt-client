import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useShop from "../hooks/useShop";
import formatDate from "../utils/formatDate";
import {
  graceEndDate,
  isInGrace,
} from "../utils/subscriptionDates";

// Whole dollars print without cents ($10); fractional prices with cents.
const formatPrice = (price) =>
  Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;

const Subscription = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const { shop, shopLoading } = useShop();
  const [interval, setInterval] = useState("monthly");
  const isPremium = shop?.subscriptionPlan === "premium";
  const hasShop = Boolean(shop?._id);
  // Past the end date but inside the 5-day grace period: the plan
  // still works, but the owner must renew or it cancels itself.
  const inGrace = isInGrace(shop);

  // Plans come from the server (the admin manages them), so a price
  // change takes effect here without a code change. The endpoint is
  // public — this page is viewable without signing in.
  const {
    data: plans = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axiosPublic.get("/plans");
      return res.data;
    },
  });

  const hasYearly = plans.some(
    (plan) => plan.yearlyPrice !== undefined && plan.yearlyPrice !== null
  );
  const shownInterval = hasYearly ? interval : "monthly";
  const maxSave = Math.max(
    0,
    ...plans
      .filter((plan) => plan.yearlyPrice != null && plan.price > 0)
      .map((plan) =>
        Math.round((1 - plan.yearlyPrice / (plan.price * 12)) * 100)
      )
  );

  // The price and billing period for one plan under the chosen toggle.
  // A plan without a yearly price stays monthly even in yearly mode.
  const billingFor = (plan) =>
    shownInterval === "yearly" && plan.yearlyPrice != null
      ? { price: plan.yearlyPrice, interval: "yearly", period: "/year" }
      : { price: plan.price, interval: "monthly", period: "/month" };

  const saveFor = (plan) =>
    plan.price > 0 && plan.yearlyPrice != null
      ? Math.round((1 - plan.yearlyPrice / (plan.price * 12)) * 100)
      : 0;

  // What each plan's button does. The page is public, so logged-out
  // visitors get working buttons too: a paid plan sends them to
  // /payment, which forces the sign-in there (and back afterwards);
  // the Free plan sends them to register, or to create their shop
  // when they already have an account.
  const ctaFor = (plan) => {
    if (shopLoading) return { label: "Loading…", disabled: true };
    if (plan.price === 0) {
      if (inGrace)
        return { label: "Your plan is expiring", disabled: true };
      if (isPremium)
        return { label: "Your plan is Premium", disabled: true };
      if (!user) return { label: "Start free", to: "/register" };
      if (!hasShop)
        return { label: "Start free", to: "/create-store-account" };
      return { label: "Current plan", disabled: true };
    }
    if (isPremium && !inGrace)
      return { label: "Current plan", disabled: true };
    if (inGrace && plan.name === shop?.planName)
      return { label: "Renew now", to: "/payment" };
    return { label: "Get started", to: "/payment" };
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, lg: 8 } }}>
        <Box
          sx={{
            mx: "auto",
            maxWidth: "48rem",
            mb: { xs: 4, lg: 6 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            fontWeight="800"
            color="primary"
            sx={{ letterSpacing: "-0.025em" }}
          >
            Choose a plan that fits your shop
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Start free with the core features. Paid plans unlock point
            of sale, barcode scanning, reports, suppliers, purchase
            orders and staff roles — and room for more products.
          </Typography>

          {isPremium && !inGrace && (
            <Alert severity="success" sx={{ mt: 3, textAlign: "left" }}>
              You&apos;re on the {shop?.planName || "Premium"} plan
              {shop?.subscriptionEndDate
                ? ` — active until ${formatDate(shop.subscriptionEndDate)}.`
                : "."}
            </Alert>
          )}
          {inGrace && (
            <Alert severity="warning" sx={{ mt: 3, textAlign: "left" }}>
              Your {shop?.planName || "Premium"} plan expired on{" "}
              {formatDate(shop.subscriptionEndDate)}. Renew by{" "}
              {formatDate(graceEndDate(shop.subscriptionEndDate))} to keep
              it — after that your shop returns to the Free plan.
            </Alert>
          )}

          {hasYearly && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <ToggleButtonGroup
                value={interval}
                exclusive
                onChange={(_, value) => value && setInterval(value)}
                aria-label="Billing period"
                color="primary"
              >
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="yearly">
                  Yearly
                  {maxSave > 0 && (
                    <Chip
                      label={`Save ${maxSave}%`}
                      size="small"
                      color="success"
                      sx={{ ml: 1 }}
                    />
                  )}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </Box>

        {isPending ? (
          <Grid container spacing={3}>
            {[0, 1, 2, 3].map((key) => (
              <Grid item xs={12} sm={6} lg={3} key={key}>
                <Skeleton variant="rounded" height={340} />
              </Grid>
            ))}
          </Grid>
        ) : isError ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            Couldn&apos;t load the plans. Please try again.
          </Alert>
        ) : plans.length === 0 ? (
          <Alert severity="info">
            No plans are available right now. Please check back later.
          </Alert>
        ) : (
          <Grid container spacing={3} alignItems="stretch">
            {plans.map((plan) => {
              const billing = billingFor(plan);
              const cta = ctaFor(plan);
              const save = saveFor(plan);
              return (
                <Grid item xs={12} sm={6} lg={3} key={plan._id || plan.name}>
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
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
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight={600}
                        sx={{ mb: 1 }}
                      >
                        {plan.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontWeight: 300, minHeight: "3em" }}
                      >
                        {plan.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                          my: 3,
                        }}
                      >
                        <Typography
                          variant="h3"
                          component="span"
                          fontWeight="800"
                        >
                          {formatPrice(billing.price)}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          {billing.period}
                        </Typography>
                      </Box>
                      {billing.interval === "yearly" && save > 0 && (
                        <Box sx={{ textAlign: "center", mt: -2, mb: 2 }}>
                          <Chip
                            label={`Save ${save}% vs monthly`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      )}
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
                        {(plan.features?.length > 0
                          ? plan.features
                          : [`Up to ${plan.productLimit} products`]
                        ).map((feature) => (
                          <Box
                            component="li"
                            key={feature}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Check
                              size={20}
                              color="#22c55e"
                              style={{ flexShrink: 0 }}
                            />
                            <span>{feature}</span>
                          </Box>
                        ))}
                      </Box>
                      <Button
                        component={cta.disabled ? "button" : Link}
                        to={cta.disabled ? undefined : cta.to}
                        state={
                          cta.disabled || cta.to !== "/payment"
                            ? undefined
                            : {
                                total: billing.price,
                                plan: plan.name,
                                interval: billing.interval,
                                limit: `Up to ${plan.productLimit} products`,
                              }
                        }
                        variant={plan.popular ? "contained" : "outlined"}
                        disabled={cta.disabled}
                        sx={{ mt: "auto" }}
                      >
                        {cta.label}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 5 }}
        >
          Payments are processed securely by Stripe. Prices are in US
          dollars.
        </Typography>
      </Container>
    </Box>
  );
};

export default Subscription;
