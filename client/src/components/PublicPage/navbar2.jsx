import React, { useState, useEffect } from 'react';
import './navBarStyle.css'; // Import styles
import logo from '../../../src/assets/logo.png'; // Import logo

function NavbarSimple() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // State to track active section

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('section'); // Select all sections with the 'section' tag
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // Trigger when 60% of the section is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Set the active section based on the section's id
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => observer.observe(section)); // Observe all sections

    return () => observer.disconnect(); // Cleanup on component unmount
  }, []);

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
            <li>
              <a href="#home" className={activeSection === 'home' ? 'active' : ''}>
                Home
              </a>
            </li>
            <li>
              <a href="#state-of-environment" className={activeSection === 'state-of-environment' ? 'active' : ''}>
                State of the Environment
              </a>
            </li>
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

export default NavbarSimple;
