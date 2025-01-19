import React, { useState } from 'react';
import './navBarStyle.css'; // Import styles specific to the navbar
import logo from '../../../src/assets/logo.png'; // Import logo dynamically

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navdiv">
        {/* Logo Section */}
        <div className="logo">
          <a href="#home">
            <img src={logo} alt="University Logo" />
          </a>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#state-of-environment">State of the Environment</a></li>
            <li><a href="#policies">Environmental Policies</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Hamburger Menu */}
        <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
