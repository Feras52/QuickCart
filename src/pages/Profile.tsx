import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import { useAuth } from "../context/AuthContext";
import { getUserInformation, getUserOrders } from "../services/userService";

import "./Profile.css";
import { FieldPath } from "firebase/firestore";

type UserInformation = {
  username?: string;
  email?: string;
  createdAt?: {
    toDate: () => Date;
  };
};

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
  id: string;
  items?: OrderItem[];
  totalPrice?: number;
  shippingAddress?: ShippingAddress;
  status?: string;
  paymentStatus?: string;
  paymentId?: string;
  createdAt?: {
    toDate: () => Date;
  };
};

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userInformation, setUserInformation] =
    useState<UserInformation | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setError("You must be logged in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const fetchedUserInformation = await getUserInformation(user.uid);
        const fetchedOrders = await getUserOrders(user.uid);

        setUserInformation(fetchedUserInformation as UserInformation);
        setOrders(fetchedOrders as Order[]);
      } catch {
        setError("Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="profile_container">
          <h1>Loading profile...</h1>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <main className="profile_container">
          <h1>{error}</h1>
          <button onClick={() => navigate("/Login")}>Go to Login</button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />

      <main className="profile_container">
        <center id="profile_container" ><img src="../../public/profile.png" alt="" />
        <p id="profile_name" >{userInformation?.username || "No username saved"}</p></center>

        <section className="profile_card">
          <h2>User Info</h2>

          <p>
            <strong>Username:</strong>{" "}
            {userInformation?.username || "No username saved"}
          </p>

          <p>
            <strong>Email:</strong> {userInformation?.email || user?.email}
          </p>

          <p>
            <strong>Account Created:</strong>{" "}
            {userInformation?.createdAt
              ? userInformation.createdAt.toDate().toDateString()
              : "Not available"}
          </p>
        </section>

        <section className="orders_section">
          <h2>Previous Orders</h2>

          {orders.length === 0 ? (
            <p>You have no previous orders yet.</p>
          ) : (
            orders.map((order) => (
              <div className="order_card" key={order.id}>
                <h3>Order ID: {order.id}</h3>

                <p>
                  <strong>Date:</strong>{" "}
                  {order.createdAt
                    ? order.createdAt.toDate().toDateString()
                    : "Not available"}
                </p>

                <p>
                  <strong>Total:</strong> ${order.totalPrice?.toFixed(2)}
                </p>

                <p>
                  <strong>Order Status:</strong> {order.status}
                </p>

                <p>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </p>

                {order.paymentId && (
                  <p>
                    <strong>Payment ID:</strong> {order.paymentId}
                  </p>
                )}

                <div className="order_items">
                  <h4>Items</h4>

                  {order.items?.map((item) => (
                    <div className="profile_order_item" key={item.id}>
                      <img src={item.imageUrl} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <div className="shipping_info">
                    <h4>Shipping Address</h4>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Profile;
