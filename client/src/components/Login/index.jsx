import React, { useState } from "react";
import axios from "axios";
import "./style.css";
//import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/UPCO_loginLogo.png';

// function Login() {
//     const title = { fontSize: "3.5rem", fontWeight: "600", color: "#545454" };
//     const tagline = { color: "#545454", marginBottom: 0 };
//     const paperStyle = { padding: "2rem", margin: "50px auto", borderRadius: "1rem", boxShadow: "5px 5px 25px", width: "80%", maxWidth: "400px" };
//     const heading = { fontSize: "1.5rem", fontWeight: "600", color: "#545454" };
//     const row = { display: "flex", marginTop: "2rem" };
//     const link = { display: "flex", marginTop: "1rem", textDecoration: "none", fontSize: "0.9rem", color: "#545454" };
//     const p = { marginLeft: "20px", color: "#545454" };
//     const div = { display: "flex", justifyContent: "space-around" };

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:3001/admin-login", { email, password })
            .then((response) => {
                if (response.data === "Success") {
                    navigate("/dashboard"); // Redirect to /dashboard on success
                } else {
                    setError("Login failed: " + response.data.error);
                }
            })
            .catch((err) => {
                console.error("Login Error:", err);
                setError("Login failed: " + (err.response?.data?.error || "An error occurred."));
            });
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
                        <h2>Cavite State University - Indang Campus <br /> State of the Environment</h2>
                        <h3>Log in to your account</h3>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                        {error && <div className="error">{error}</div>}
                        <Link to="/forgotpass" className="link">
                            Forgot password?
                        </Link>
                        <button type="submit" className="btn">
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

    export default Login;

        
        /*<>*/
                /* <Typography style={title}>UPCO</Typography>
                 <p style={tagline}>Discover Pollution Trends at Cavite State University Indang Campus</p>
                 <Paper style={paperStyle}>
                     <form onSubmit={handleSubmit}>
                         <Typography style={heading}><strong>Log In</strong></Typography>
                         <TextField
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            className="inputField"
                            style={row}
                            label="Enter Email"
                            type="email"
                            required
                        />
                        <TextField
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            className="inputField"
                            style={row}
                            label="Enter Password"
                            type="password"
                            required
                        />
                        <Link style={link} to="/forgot-password">Forgot Password?</Link>
                        <Button
                            type="submit"
                            className="btn"
                            variant="contained"
                            fullWidth>
                            Log In
                        </Button>
                    </form>
                </Paper> */
        /*</>*/ 
