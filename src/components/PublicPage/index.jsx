import React from "react";
import Navbar from "./navBar.jsx"; // Correctly importing the Navbar component
import './indexStyle.css';

// Importing images dynamically
import logo from '../../../src/assets/logo.png';
import UPCO_logo from '../../../src/assets/UPCO_logo.png';
import cvsuBg from '../../../src/assets/cvsu_bg.png';

function PublicPage() {
  return (
    <div>
      <Navbar />
      <section
        className="hero"
        style={{
          backgroundImage: `url(${cvsuBg})`,
        }}
      >
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

      <div className="container">
        <section className="state-of-environment">
          <h2>State of the Environment</h2>
          <div>
            <h3>Top 10 Solid Waste Generators</h3>
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Waste (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Location 1</td>
                  <td>123</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </section>

        <section className="environmental-policies">
          <h2>University Pollution Control Office Environmental Policies</h2>
          <div className="policy-cards">
            <div className="policy-card">
              <h3>Policy 1</h3>
              <p>Description of policy 1</p>
            </div>
            <div className="policy-card">
              <h3>Policy 2</h3>
              <p>Description of policy 2</p>
            </div>
            {/* Add more policy cards as needed */}
          </div>
        </section>
      </div>

      <footer className="footer">
        <img src={logo} alt="Footer Logo" />
        <p>Contact Information</p>
        <p>Phone: +1234567890</p>
        <p>Email: info@university.edu</p>
      </footer>
    </div>
  );
}

export default PublicPage;
