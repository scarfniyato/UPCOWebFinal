import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../style.css";
import logo from '../../../assets/UPCO_loginLogo.png';

const ResetPassword = () => {
  const { userId, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:3001/api/password-reset/${userId}/${token}`,
        { password }
      );
      setMessage(data.message || "Password reset successfully");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login_container">
      <div className="login_form_container">
        
        <div className="left">
          <div className="left_content">
            <img src={logo} alt="UPCO Logo" />
            <h1>University Pollution Control Office</h1>
            <h2>Para sa Kalikasan, Para sa Kinabukasan!</h2>
          </div>
        </div>
      

        <div className="right">
          <form className="form_container" onSubmit={handleSubmit}>
            <h1>UPCO | CvSU</h1>
            <h2>
              Cavite State University - Indang Campus <br /> State of the
              Environment
            </h2>
            <h3>Reset Password</h3>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              required
              className="input"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
              className="input"
            />

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            <button type="submit" className="btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
