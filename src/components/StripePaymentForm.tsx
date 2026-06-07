import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { createPaymentIntent } from "../services/paymentService";

type StripePaymentFormProps = { //data/instruction checkout (parent) gonna hand down to this form
    amount: number;
    disabled: boolean;
    onBeforePay: () => boolean; //checks if user filled checkout form
    onSuccess: (paymentId: string) => Promise<void>; //callback action to tell checkout to run its code (the promise code (empty cart...))
};

function StripePaymentForm({amount,disabled,onBeforePay,onSuccess,}:StripePaymentFormProps){
    const stripe = useStripe();
    const elements = useElements();

    const [paymentError, setPaymentError] = useState("");
    const [paying, setPaying] = useState(false);

    const handlePayment = async () => {
        setPaymentError("");

        if (!onBeforePay()) {
            return;
        }

        if (!stripe || !elements) {
            setPaymentError("Stripe error");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement){
            setPaymentError("Card input error");
            return;
        }

        try{
            setPaying(true);

            const clientSecret = await createPaymentIntent(amount);

            const result = await stripe.confirmCardPayment(clientSecret, {payment_method:{card:cardElement,},});

            if (result.error){
                setPaymentError("Stripe confirmation error");
                return;
            }

            if (result.paymentIntent.status === "succeeded"){
                await onSuccess(result.paymentIntent.id);
            }

        }
        catch{
            setPaymentError("Something went wrong during payment");
        }
        finally{
            setPaying(false);
        }

    };

    return (
        <section className="payment_placeholder">
            <h2>Payment</h2>
            <CardElement />

            {paymentError && <p className="checkout_error" >{paymentError}</p>}

            <button type="button" className="place_order_btn" onClick={handlePayment} disabled = {disabled || paying}> {paying? "Processing payment...":`Pay $${amount.toFixed(2)}`} </button>

        </section>
    );
}

export default StripePaymentForm;