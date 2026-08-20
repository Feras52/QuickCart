import "./Cart.css";

import { useNavigate } from "react-router-dom";

import { useCartStore } from "../store/cartStore";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

function Cart() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  if (items.length === 0) {
    return (
      <>
        <NavBar />

        <main className="cart_container empty_cart">
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

      <main className="cart_container">
        <h1>Your Cart</h1>

        {items.map((item) => (
          <div className="cart_item" key={item.id}>
            <img src={item.imageUrl} alt={item.name} width="100" />
            <h2>{item.name}</h2>
            <p>Price: ${item.price}</p>

            <div className="quantity_controls">
              <button onClick={() => updateQty(item.id, item.quantity - 1)}>
                -
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => updateQty(item.id, item.quantity + 1)}>
                +
              </button>
            </div>

            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}

        <div className="cart_total">
          <h2>Total: ${getTotalPrice().toFixed(2)}</h2>

          <div className="cart_actions">
            <button onClick={() => navigate("/Shop")}>Continue Shopping</button>
            <button onClick={() => navigate("/Checkout")}>Checkout</button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cart;
