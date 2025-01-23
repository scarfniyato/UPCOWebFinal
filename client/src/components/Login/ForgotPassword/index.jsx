import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style.css";
import logo from '../../../assets/UPCO_loginLogo.png';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(false); // To disable the button
    const [timer, setTimer] = useState(0); // Timer state

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(  
                "http://localhost:3001/api/password-reset/send-reset-email",
                { email }
            );
            setMessage(response.data.message);

            // Start the timer
            setIsDisabled(true);
            setTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        }
    };

    // Effect to handle the timer countdown
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsDisabled(false); // Re-enable the button after timer ends
        }
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [timer]);

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
                        <h2>Cavite State University - Indang Campus <br />State of the Environment</h2>
                        <h3>Forgot Password</h3>

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                        />

                        {message && <p className="success">{message}</p>}
                        {error && <p className="error">{error}</p>}

                        <button
                            type="submit"
                            className="btn"
                            disabled={isDisabled} // Disable button when timer is running
                        >
                            {isDisabled ? `Send Reset Link (${timer}s)` : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

