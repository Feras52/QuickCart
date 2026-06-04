import Signin from "./pages/Signin.tsx";
import Login from "./pages/Login.tsx";
import AboutUs from "./pages/AboutUs.tsx";
import Home from "./pages/Home.tsx";
import Cart from "./pages/Cart.tsx";

import Checkout from "./pages/Checkout";

import { Routes, Route } from "react-router-dom";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/OrderConfirmation/:orderId" element={<OrderConfirmation/>} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
