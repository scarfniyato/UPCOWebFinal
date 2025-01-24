import React, { useState, useEffect } from "react";
import Navbar from "./navBar.jsx";
import './indexStyle.css';
import Map from "./Map/Map.jsx";
import Top10TableList from "./Map/top10TableList.jsx";
import PublicEnviPolicies from './publicEnviPolicies.jsx';
import { Link } from "react-router-dom";

// Importing images dynamically
import emailIcon from '../../../src/assets/email-icon.png';
import UPCO_logo from '../../../src/assets/UPCO_logo.png';
import cvsuBg from '../../../src/assets/cvsu_bg.png';
import emaillIcon from '../../../src/assets/emailIcon.png';
import phoneIcon from '../../../src/assets/phoneIcon.png';
import locIcon from '../../../src/assets/locIcon.png';
import land from '../../../src/assets/land.png';
import water from '../../../src/assets/water.png';
import air from '../../../src/assets/air.png';

function PublicPage() {
  const [latestMonth, setLatestMonth] = useState('');
  const [latestYear, setLatestYear] = useState('');
  const [error, setError] = useState(null);

  // Fetch the latest month and year
  const fetchLatestData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/latest-waste-data');
      if (!response.ok) throw new Error('Failed to fetch latest data.');
      const { month, year } = await response.json();
      setLatestMonth(month);
      setLatestYear(year);
    } catch (error) {
      console.error('Error fetching latest data:', error);
      setError('Failed to load latest data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  return (
    <div>
      <Navbar />
      <section id="home" className="hero" style={{ backgroundImage: `url(${cvsuBg})` }}>
        <div className="leftHero">
          <h1>
            Discover<br />State of the Environment at<br />Cavite State University<br />Indang Campus
          </h1>
          <p>
            Stay informed and help create a cleaner,<br />
            greener future for our campus community.
          </p>
          <p>Para sa Kalikasan, Para sa Kinabukasan!</p>
          <button>Learn More</button>
        </div>

        <div className="rightHero">
          <img src={UPCO_logo} alt="University Logo" />
        </div>
      </section>

      <div id="state-of-environment" className="outerContainer">
        <div className="header">
          <h1>State of the Environment</h1>
          <h3>Cavite State University - Main Campus</h3>
        </div>

        <div className="dataContainer" style={{ padding: '30px' }}>
          <h5>CvSU Main Campus - Map</h5>
          <p style={{ marginBottom: '-10px' }}>
            Month:  <strong>{latestMonth || 'Loading...'}</strong> <span style={{ margin: '0 5px' }}></span>
            Year: <strong>{latestYear || 'Loading...'} </strong>
          </p>
          <Map />
        </div>

        <div className="dataContainer" style={{ padding: '30px' }}>
          <h5 className="fbold text-xl mb-4">Top 10 Solid Waste Generators</h5>
          <Top10TableList />
        </div>

        <div className="pollutions">
          <div className="dataContainer" style={{ padding: '30px 0' }}>
            <div className="dataContainer2">
              <img src={land} alt="Land Pollution" />
              
              <div className="btn">
              <Link to="/landpollution">
              Land Pollution</Link>
              </div>
            </div>
          </div>

          <div className="dataContainer" style={{ padding: '30px 0' }}>
            <div className="dataContainer2">
              <img src={air} alt="Air Pollution" />
              <div className="btn">
              <Link to="/airpollution">
                Air Pollution</Link>
                </div>
              </div>
          </div>

          <div className="dataContainer" style={{ padding: '30px 0' }}>
            <div className="dataContainer2">
              <img src={water} alt="Water Pollution" />
              
              <div className="btn">
              <Link to="/waterpollution">
              Water Pollution</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="policies" className="outerContainer">
        <div className="header">
          <h1>Environmental Policies </h1>
          <h3>of University Pollution Control Office</h3>
        </div>
        <div className="dataContainer">
          <PublicEnviPolicies />
        </div>
      </div>

      <footer id="contact" className="contactSection">
        <div className="contact-container">
          {/* Logo Section */}
          <div className="contact-logo">
            <img src={UPCO_logo} alt="University Logo" />
          </div>

          {/* Contact Information Section */}
          <div className="contact-info">
            <h2>Contact Information</h2>

            <div className="contactItem">
              <img src={emaillIcon} alt="Email Icon" />
              <div>
                <p>Email:</p>
                <h5>contact@gmail.com</h5>
              </div>
            </div>

            <div className="contactItem">
              <img src={phoneIcon} alt="Phone Icon" />
              <div>
                <p>Phone:</p>
                <h5>09123456789</h5>
              </div>
            </div>

            <div className="contactItem">
              <img src={locIcon} alt="Location Icon" />
              <div>
                <p>Location:</p>
                <h5>CvSU-Main Campus</h5>
              </div>
            </div>
          </div>

          {/* Call-to-Action Section */}
          <div className="contact-cta">
            <h2>Have a question or feedback? Reach out to us</h2>
            <div className="cta-content">
              <img src={emailIcon} alt="Email Icon" className="cta-icon" />
              <button className="email-btn">Email Us</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicPage;
