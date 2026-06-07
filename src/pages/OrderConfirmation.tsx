import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import "./OrderConfirmation.css";

function OrderConfirmation() {
  type OrderItem = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  };

  type ShippingAddress = {
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };

  type Order = {
    items: OrderItem[];
    totalPrice: number;
    shippingAddress: ShippingAddress;
    status: string;
    paymentStatus: string;
    paymentId?: string; // ? == optional
  };

  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // estimaed duration: 5 days
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 5);

  //When page opens, check if orderId exists, if yes: find doc with the orderId in firestore, if doc exists save it in orderState else error
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID not found.");
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder(orderSnap.data() as Order);
        } else {
          setError("Order not found.");
        }
      } catch {
        setError("Something went wrong while loading the order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="confirmation_container">
          <h1>Loading order...</h1>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <NavBar />
        <main className="confirmation_container">
          <h1>{error}</h1>
          <button onClick={() => navigate("/Home")}>Back to Home</button>
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <NavBar />

      <main className="confirmation_container">
        <h1>Order Placed Successfully</h1>

        <section className="confirmation_section">
          <h2>Order ID</h2>
          <p>{orderId}</p>
        </section>

        <section className="confirmation_section">
          <h2>Order Summary</h2>

          {order.items.map((item) => (
            <div className="confirmation_item" key={item.id}>
              <img src={item.imageUrl} alt={item.name} width="80" />
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          ))}

          <h3>Total: ${order.totalPrice.toFixed(2)}</h3>
        </section>

        <section className="confirmation_section">
          <h2>Shipping Address</h2>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.email}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </section>

        <section className="confirmation_section">
          <h2>Payment Status</h2>
          <p>{order.paymentStatus === "paid" ? "Paid" : "Pending"}</p>
          <p>Order Status: {order.status}</p>
          {order.paymentId && <p>Payment ID: {order.paymentId}</p>}
        </section>

        <section className="confirmation_section">
          <h2>Estimated Delivery</h2>
          <p>{estimatedDeliveryDate.toDateString()}</p>
        </section>

        <button className="confirmation_btn" onClick={() => navigate("/Home")}>
          Back to Home
        </button><br /><br />
      </main>

      <Footer />
    </>
  );
}

export default OrderConfirmation;
