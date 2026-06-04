import { useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { useCartStore } from "../store/cartStore";

function Checkout() {
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault(); //prevent page refreshing
    setError("");

    if (!fullName || !email || !address || !city || !zipCode || !country) {
      setError("Please fill all shipping fields.");
      return;
    }

    setLoading(true);

    const orderData = {
      items,
      totalPrice: getTotalPrice(),
      shippingAddress: {
        fullName,
        email,
        address,
        city,
        zipCode,
        country,
      },
    };

    console.log("Order ready to save:", orderData); //just for now

    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <>
        <NavBar />

        <main>
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

      <main>
        <h1>Checkout</h1>

        <section>
          <h2>Order Summary</h2>

          {items.map((item) => (
            <div key={item.id}>
              <img src={item.imageUrl} alt={item.name} width="80" />
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}

          <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
        </section>

        <section>
          <h2>Shipping Address</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handlePlaceOrder}>
            <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>

            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/>

            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}/>

            <input type="text" placeholder="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)}/>

            <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)}/>

            <section>
              <h2>Payment</h2>
              <p>Payment will be added later.</p>
            </section>

            <button type="submit">
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;