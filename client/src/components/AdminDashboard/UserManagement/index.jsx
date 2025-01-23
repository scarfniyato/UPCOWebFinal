import React, { useState } from "react";
import axios from "axios";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddUserAccount() {
    const paperStyle = { padding: "2rem", margin: "50px auto", borderRadius: "1rem", boxShadow: "5px 5px 25px" };
    const heading = { fontSize: "1.5rem", fontWeight: "600", color: "#545454" };
    const row = { display: "flex", marginTop: "2rem" };

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:3001/addAccount", { name, email, password })
            .then((response) => {
                if (response.status === 201) {
                    console.log("User created successfully.");
                    navigate("/admin-login");
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    window.alert("Email already exists. Please use a different email.");
                } else {
                    console.error(err);
                }
            });
    };

    return (
        <Grid align="center">
            <Paper
                style={paperStyle}
                sx={{
                    width: {
                        xs: "80vw",
                        sm: "50vw",
                        md: "40vw",
                        lg: "30vw",
                        xl: "20vw",
                    },
                    height: "auto",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Typography style={heading}>
                        <strong>Add Account</strong>
                    </Typography>
                    <TextField
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        required
                        className="inputField"
                        style={row}
                        label="Enter Name"
                        type="text"
                    />
                    <TextField
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        required
                        className="inputField"
                        style={row}
                        label="Enter Email"
                        type="email"
                    />
                    <TextField
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        required
                        className="inputField"
                        fullWidth
                        style={row}
                        label="Enter Password"
                        type="password"
                    />
                    <Button className="btn" type="submit" variant="contained" fullWidth>
                        Create Account
                    </Button>
                </form>
            </Paper>
        </Grid>
    );
}

export default AddUserAccount;