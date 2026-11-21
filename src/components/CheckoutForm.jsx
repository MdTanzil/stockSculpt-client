/* eslint-disable react/prop-types */
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Check,
  CheckCircle2,
  Copy,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import useShop from "../hooks/useShop";

// Stripe's official test cards (docs.stripe.com/testing). The store runs
// in Stripe test mode, so these move no real money. Stripe Elements is an
// iframe, so a card number cannot be typed in for the user — the copy
// button puts it on the clipboard and the user pastes it into the card
// field. Use any future expiry date (e.g. 12/34) and any 3-digit CVC.
const TEST_CARDS = [
  {
    label: "Visa",
    number: "4242 4242 4242 4242",
    result: "Payment succeeds",
  },
  {
    label: "Mastercard",
    number: "5555 5555 5555 4444",
    result: "Payment succeeds",
  },
  {
    label: "American Express",
    number: "3782 822463 10005",
    result: "Payment succeeds",
  },
  {
    label: "Declined card",
    number: "4000 0000 0000 9995",
    result: "Payment is declined",
  },
  {
    label: "3D Secure",
    number: "4000 0025 0000 3155",
    result: "Asks for 3D Secure authentication",
  },
];

const CheckoutForm = ({ total, plan, interval, limit }) => {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [name, setName] = useState("");
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const [copiedNumber, setCopiedNumber] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { shop, shopLoading } = useShop();
  const theme = useTheme();
  const totalPrice = total;
  const hasShop = Boolean(shop?._id);

  // Stripe's Elements are iframes on the card's paper background, so
  // their text colors must adapt to the theme — the previous dark-slate
  // colors would be unreadable on the dark paper in dark mode.
  const isDark = theme.palette.mode === "dark";
  const elementStyle = {
    base: {
      fontSize: "16px",
      color: isDark ? "#e8eaed" : "#424770",
      "::placeholder": {
        color: isDark ? "#9aa0a6" : "#8a8fa3",
      },
    },
    invalid: {
      color: theme.palette.error.main,
    },
  };

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user]);

  useEffect(() => {
    if (totalPrice > 0) {
      axiosSecure
        .post("/create-payment-intent", {
          price: totalPrice,
          plan,
          interval,
        })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          // 503 means the server has no Stripe secret key yet — a setup
          // problem, not a payment problem, so it gets its own notice.
          if (err.response?.status === 503) {
            setNotConfigured(true);
          } else {
            setError(
              err.response?.data?.error ||
                "Payment is not available right now. Please try again later."
            );
          }
        });
    }
  }, [axiosSecure, totalPrice, plan, interval]);

  const copyCardNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number.replaceAll(" ", ""));
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(""), 2000);
    } catch {
      // Clipboard access can be blocked (permissions, insecure context);
      // the number is still visible, so the user can type it.
      setError("Couldn't copy — please type the card number instead.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret || processing) return;

    setProcessing(true);
    setError("");

    // confirmCardPayment handles 3D Secure itself: if the card needs
    // authentication, Stripe opens the challenge and resumes here.
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: name || user?.displayName || "anonymous",
            email: user?.email || "anonymous",
          },
        },
      });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        const res = await axiosSecure.post("/payments", {
          email: user.email,
          price: totalPrice,
          transactionId: paymentIntent.id,
          plan,
          interval,
        });
        if (res.data?.paymentResult?.insertedId) {
          setTransactionId(paymentIntent.id);
        } else {
          setError(
            "Your payment went through, but we couldn't record it. Please contact support with transaction id " +
              paymentIntent.id +
              "."
          );
        }
      } catch {
        setError(
          "Your payment went through, but we couldn't record it. Please contact support with transaction id " +
            paymentIntent.id +
            "."
        );
      }
    }
    setProcessing(false);
  };

  const cardReady =
    cardComplete.number && cardComplete.expiry && cardComplete.cvc;
  const canPay =
    stripe &&
    clientSecret &&
    cardReady &&
    !processing &&
    !shopLoading &&
    hasShop;

  if (transactionId) {
    return (
      <Card sx={{ my: 4 }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <CheckCircle2 size={56} color="#22c55e" />
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
            Payment successful!
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Your {plan || "subscription"} plan
            {interval === "yearly" ? " (yearly)" : " (monthly)"} is now
            active on your shop.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontFamily: "monospace" }}
          >
            Transaction: {transactionId}
          </Typography>
          <Button
            component={Link}
            to="/dashboard"
            variant="contained"
            sx={{ mt: 3, fontWeight: 600 }}
          >
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
        Complete your purchase
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        You&apos;re upgrading your shop — this only takes a moment.
      </Typography>

      <Grid container spacing={3} alignItems="flex-start">
        {/* Order summary */}
        <Grid item xs={12} md={5}>
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Order summary
                </Typography>
                <Chip label="TEST MODE" size="small" color="warning" />
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography color="text.secondary">Plan</Typography>
                <Typography fontWeight="600">{plan || "Subscription"}</Typography>
              </Box>
              {limit && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography color="text.secondary">Products</Typography>
                  <Typography>{limit}</Typography>
                </Box>
              )}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography color="text.secondary">Billing</Typography>
                <Typography>
                  {interval === "yearly" ? "Yearly" : "Monthly"}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Total
                </Typography>
                <Typography variant="h5" fontWeight="800">
                  ${Number(totalPrice).toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", gap: 1, mt: 3, alignItems: "center" }}
              >
                <ShieldCheck size={18} color="#22c55e" />
                <Typography variant="body2" color="text.secondary">
                  Payments are processed securely by Stripe. No real money
                  moves in test mode.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment form */}
        <Grid item xs={12} md={7}>
          <Card variant="outlined">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Payment details
              </Typography>

              {notConfigured ? (
                <Alert severity="warning">
                  Payments aren&apos;t set up yet — the shop owner needs to
                  add the Stripe secret key before anyone can pay.
                </Alert>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Name on card"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                    sx={{ mb: 2 }}
                    required
                  />
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Card number
                  </Typography>
                  <Box
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                      p: 1.5,
                      mb: 2,
                    }}
                  >
                    <CardNumberElement
                      options={{ style: elementStyle }}
                      onChange={(e) =>
                        setCardComplete((prev) => ({
                          ...prev,
                          number: e.complete,
                        }))
                      }
                    />
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        Expiry date
                      </Typography>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          p: 1.5,
                        }}
                      >
                        <CardExpiryElement
                          options={{ style: elementStyle }}
                          onChange={(e) =>
                            setCardComplete((prev) => ({
                              ...prev,
                              expiry: e.complete,
                            }))
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        CVC
                      </Typography>
                      <Box
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1,
                          p: 1.5,
                        }}
                      >
                        <CardCvcElement
                          options={{ style: elementStyle }}
                          onChange={(e) =>
                            setCardComplete((prev) => ({
                              ...prev,
                              cvc: e.complete,
                            }))
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  {!shopLoading && !hasShop && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Create your shop first — the plan will apply to it.{" "}
                      <Link to="/create-store-account">Create shop</Link>
                    </Alert>
                  )}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={!canPay}
                    startIcon={
                      processing ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <Lock size={18} />
                      )
                    }
                    sx={{ fontWeight: 700, py: 1.5 }}
                  >
                    {processing
                      ? "Processing…"
                      : `Pay $${Number(totalPrice).toFixed(2)}`}
                  </Button>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1.5 }}
                  >
                    Secured by Stripe
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Test cards */}
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600">
            Try it with a test card
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Copy a card number, paste it into the card field, and use any
            future expiry date (e.g. 12/34) and any 3-digit CVC. These are
            Stripe&apos;s official test cards — no real money moves.
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column" }}>
            {TEST_CARDS.map((card, index) => (
              <Box
                key={card.number}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  py: 1.25,
                  borderTop: index === 0 ? 0 : 1,
                  borderColor: "divider",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight="600">{card.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.result}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    sx={{ fontFamily: "monospace", letterSpacing: "0.03em" }}
                  >
                    {card.number}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyCardNumber(card.number)}
                    aria-label={`Copy ${card.label} test card number`}
                  >
                    {copiedNumber === card.number ? (
                      <Check size={18} color="#22c55e" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CheckoutForm;
