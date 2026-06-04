import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { useCartStore } from "../store/cartStore";

type ShippingAddress = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
};

type OrderItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export const createOrder = async (
  userId: string,
  cartItems: OrderItem[],
  totalPrice: number,
  shippingAddress: ShippingAddress,
) => {
  //save order info into the collection 'orders' in firestore (auto creation of orderID by addDoc )
  const orderRef = await addDoc(collection(db, "orders"), {
    userId,
    items: cartItems,
    totalPrice,
    shippingAddress,
    status: "pending",
    paymentStatus: "pending",
    createdAt: serverTimestamp(),
  });

  useCartStore.getState().clearCart();

  return orderRef.id;
};
