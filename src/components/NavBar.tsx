import "./NavBar.css";
import {Link} from 'react-router-dom';
function NavBar() {

  return (
    <div id="navbarid">
      <nav>
        <p id="homeLink"> <Link  to="/Home" >QuickCart</Link> </p>
         <Link to="/Home" > <img src="../../public/logo.png" alt="Logo" /></Link>
        <ul>
          <li> <Link to="/Home" >Home</Link> </li>
          <li> <Link to="/Login">Log in</Link> </li>
          <li><Link to="/AboutUs" >About us</Link></li>
          <li><a href="">Profile</a></li>
        </ul>
      </nav>
      </div>
    
  );
}

export default NavBar;
