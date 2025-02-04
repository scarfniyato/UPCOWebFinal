import React, { useState, useEffect } from "react";
import { Link as ScrollLink, scroller } from "react-scroll";
import "./navBarStyle.css";
import logo from "../../../src/assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    scroller.scrollTo(sectionId, {
      duration: 1500,
      smooth: "easeInOutQuad",
      offset: -70,
    });
    setMenuOpen(false);
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Scroll event handler to hide navbar
  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setIsScrollingDown(true); // Scrolling down
    } else {
      setIsScrollingDown(false); // Scrolling up
    }
    setLastScrollY(window.scrollY); // Update the last scroll position
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav className={`navbar ${isScrollingDown ? "hidden" : ""}`}>
      <div className="navdiv">
        {/* Logo Section */}
        <div className="logo">
          <ScrollLink
            to="home"
            smooth="easeInOutQuad"
            duration={1500}
            offset={-70}
            onClick={() => handleNavClick("home")}
          >
            <img src={logo} alt="University Logo" />
          </ScrollLink>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <ul>
            {[
              { id: "home", label: "Home" },
              { id: "state-of-environment", label: "State of the Environment" },
              { id: "policies", label: "Environmental Policies" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <li key={item.id}>
                <ScrollLink
                  to={item.id}
                  smooth="easeInOutQuad"
                  duration={1500}
                  offset={-70}
                  className={activeSection === item.id ? "active" : ""}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Hamburger Menu */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;