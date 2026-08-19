import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "./Hero.css";

import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <section id="banner">
        <h1>Your World of Shopping, Simplified.</h1>
        <h2>
          Upgrade your lifestyle with premium electronics, home essentials, and
          modern apparel
        </h2>
        <button onClick={() => navigate("/Shop")}>Shop Now</button>
      </section>
      <section id="wwr">
        <h2>Who We Are</h2>
        <h3>
          <p>QuickCart is a mini online marketplace built to make shopping easier
          for everyone.</p> We focus on simple design, easy navigation, and
          quick access to products
        </h3>
      </section>
      <section id="prop">
        <div>
          <center >
            <img className="hero_img" src="../../public/cart.png" /> <h2>Simple Shopping</h2>{" "}
            <h4>Browse and buy with ease</h4>
          </center>
        </div>
        <div>
          <center >
            <img className="hero_img" src="../../public/fast.png" /> <h2>Fast & Easy Checkout</h2>{" "}
            <h4>Secure & rapid payments using Stripe</h4>
          </center>
        </div>
        <div>
          <center >
            <img className="hero_img" src="../../public/globe.png" /> <h2>Accessible Anywhere</h2>{" "}
            <h4>Shop from anywhere in the world</h4>
          </center>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Hero;
