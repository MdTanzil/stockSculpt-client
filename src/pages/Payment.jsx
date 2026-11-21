import { Elements } from "@stripe/react-stripe-js";

import { Button, Container, Typography } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useLocation } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51OHMKeAljnpmqbV4b1FZGSahtsdJ5p62rq5zAbeevMYfXMbPgbICWy6z28XzH4nUqXMQS2FM1qrodRQpbNOifYyw009tiuC9Xq"
);

const Payment = () => {
  const { state } = useLocation();
  const total = state?.total;
  const plan = state?.plan;
  const interval = state?.interval || "monthly";
  const limit = state?.limit;

  if (!total) {
    return (
      <Container maxWidth="sm" sx={{ my: 10, textAlign: "center" }}>
        <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
          No payment selected
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Please choose a subscription plan first.
        </Typography>
        <Button
          component={Link}
          to="/subscription"
          variant="contained"
          sx={{ mt: 3, fontWeight: 600 }}
        >
          View Plans
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ px: 2 }}>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          total={total}
          plan={plan}
          interval={interval}
          limit={limit}
        />
      </Elements>
    </Container>
  );
};

export default Payment;
