import { Elements } from "@stripe/react-stripe-js";

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

  if (!total) {
    return (
      <div className="container mx-auto my-20 max-w-md text-center">
        <h2 className="text-2xl font-bold text-primary">No payment selected</h2>
        <p className="mt-2 text-muted-foreground">
          Please choose a subscription plan first.
        </p>
        <Link
          to="/subscription"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full max-w-xl px-4">
      <Elements stripe={stripePromise}>
        <CheckoutForm total={total}></CheckoutForm>
      </Elements>
    </div>
  );
};

export default Payment;
