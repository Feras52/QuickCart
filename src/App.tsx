import Signin from "./pages/Signin.tsx";
import Login from "./pages/Login.tsx";
import Shop from "./pages/Shop.tsx";
import Cart from "./pages/Cart.tsx";
import Profile from "./pages/Profile";
import Hero from "./pages/Hero.tsx";

import Checkout from "./pages/Checkout";

import "bootstrap-icons/font/bootstrap-icons.css";

import { Routes, Route } from "react-router-dom";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/OrderConfirmation/:orderId" element={<OrderConfirmation/>} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Shop" element={<Shop />} />
      </Routes>
    </>
  );
}

export default App;
