import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { useCartStore } from "../store/cartStore";

import { createOrder } from "../services/orderService";
import { useAuth } from "../context/AuthContext";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../components/StripePaymentForm";

import "./Checkout.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  //gets all the products and their total
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCheckout = () => {
    setError("");

    if (!user) {
      setError("You must be logged in to place an order.");
      return false;
    }

    if (!fullName || !email || !address || !city || !zipCode || !country) {
      setError("Please fill all shipping fields.");
      return false;
    }

    return true;
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!user) {
      setError("You must be logged in to place an order.");
      return;
    }

    try {
      setLoading(true);

      const orderId = await createOrder(
        user.uid,
        items,
        getTotalPrice(),
        {
          fullName,
          email,
          address,
          city,
          zipCode,
          country,
        },
        paymentId,
      );

      navigate(`/OrderConfirmation/${orderId}`);
    } catch {
      setError("Payment succeeded, but saving the order failed.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <NavBar />

        <main className="checkout_container">
          <h1>Your cart is empty</h1>
          <button onClick={() => navigate("/Home")}>Continue Shopping</button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />

      <main className="checkout_container">
        <h1>Checkout</h1>
        <div className="checkout_layout">
          <section className="order_summary">
            <h2>Order Summary</h2>

            {items.map((item) => (
              <div className="summary_item" key={item.id}>
                <img src={item.imageUrl} alt={item.name} width="80" />
                <p>{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price}</p>
              </div>
            ))}

            <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
          </section>

          <section className="shipping_form">
            <h2>Shipping Address</h2>

            {error && (
              <p className="checkout_error" style={{ color: "red" }}>
                {error}
              </p>
            )}

            <form
              onSubmit={(e) => e.preventDefault()}
              className="checkout_form"
            >
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />

              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  amount={getTotalPrice()}
                  disabled={loading}
                  onBeforePay={validateCheckout}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;
