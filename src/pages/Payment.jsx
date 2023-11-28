import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe('pk_test_51OHMKeAljnpmqbV4b1FZGSahtsdJ5p62rq5zAbeevMYfXMbPgbICWy6z28XzH4nUqXMQS2FM1qrodRQpbNOifYyw009tiuC9Xq');
const Payment = () => {
    let { state } = useLocation();
    console.log(state.total);
    return (
        <div className="container mx-auto w-1/2">
            <Elements stripe={stripePromise}>
                <CheckoutForm total= {state.total}></CheckoutForm>
            </Elements>
        </div>
    );
};

export default Payment;