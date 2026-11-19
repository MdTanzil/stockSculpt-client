/* eslint-disable react/prop-types */
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";

// import useCart from "../../../hooks/useCart";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
const CheckoutForm = ({total }) => {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [, setTransactionId] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  // const [cart, refetch] = useCart();
  const navigate = useNavigate();
  const totalPrice = total;
  useEffect(() => {
    if (totalPrice > 0) {
      axiosSecure
        .post("/create-payment-intent", { price: totalPrice })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch(() => {
          setError(
            "Payment is not available right now. Please try again later."
          );
        });
    }
  }, [axiosSecure, totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
        return
    }

    const card = elements.getElement(CardElement)

    if (card === null) {
        return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card
    })

    if (error) {
        console.log('payment error', error);
        setError(error.message);
    }
    else {
        console.log('payment method', paymentMethod)
        setError('');
    }

    // confirm payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                email: user?.email || 'anonymous',
                name: user?.displayName || 'anonymous'
            }
        }
    })

    if (confirmError) {
        console.log('confirm error')
    }
    else {
        console.log('payment intent', paymentIntent)
        if (paymentIntent.status === 'succeeded') {
            console.log('transaction id', paymentIntent.id);
            setTransactionId(paymentIntent.id);

            // now save the payment in the database
            const payment = {
                email: user.email,
                price: totalPrice,
                transactionId: paymentIntent.id,
                date: new Date(), // utc date convert. use moment js to 
                // cartIds: cart.map(item => item._id),
                // menuItemIds: cart.map(item => item.menuId),
                status: 'pending'
            }

            const res = await axiosSecure.post('/payments', payment);
            if (res.data?.paymentResult?.insertedId) {
                Swal.fire({
                    position: "top-center",
                    icon: "success",
                    title: "payment compleated",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/dashboard')
            }

        }
    }

}
  
  return (
    <Card sx={{ my: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography
            variant="h6"
            component="h2"
            align="center"
            sx={{
              mb: 2,
              p: 1,
              borderRadius: 4,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            Enter Your card
          </Typography>

          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              p: 2,
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "20px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#023047",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Button
              variant="contained"
              size="small"
              type="submit"
              disabled={!stripe || !clientSecret}
              sx={{ width: "33%" }}
            >
              Pay
            </Button>
          </Box>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
