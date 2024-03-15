import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">EasyRide</div>
        <button className="navbar-toggle" onClick={toggleNavbar}>
          <span className="navbar-icon">&#9776;</span>
        </button>
        <ul className={isOpen ? "navbar-menu active" : "navbar-menu"}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Book Cab
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/Bookings" className="navbar-link">
              Bookings
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/Cabs" className="navbar-link">
              Cabs
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
