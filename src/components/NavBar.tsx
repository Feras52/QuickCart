import "./NavBar.css";

import {Link, useNavigate} from 'react-router-dom';

import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

import { useAuth } from "../context/AuthContext";
import { useCartStore } from "../store/cartStore";

function NavBar() {

  const {user} = useAuth();
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    }
    catch{
      alert("Something went wrong! ");
    }
  };


  return (
    <div id="navbarid">
      <nav>
        <p id="homeLink"> <Link  to="/Home" >QuickCart</Link> </p>
         <Link to="/Home" > <img src="../../public/logo.png" alt="Logo" /></Link>
        <ul>
          <li> <Link to="/Home" >Home</Link> </li>
          <li><a href="">Profile</a></li>
          <li><Link to="/Cart">Cart{cartCount > 0 && <span className="cart_badge">{cartCount}</span>}</Link></li>
          <li><Link to="/AboutUs" >About us</Link></li>
          {user ? (
          // If logged in then turn the button into a Logout 
          <li><button className="nav-btn" onClick={handleLogout}>Logout </button></li>) : (
          // If logged out it stays as a normal Link to the Login page
          <li><Link to="/Login">Login</Link></li>
        )}
        </ul>
      </nav>
      </div>
    
  );
}

export default NavBar;
