import React, { useState } from "react";
import axios from "axios";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md"; 
import { Link } from "react-router-dom";

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
                    navigate("/dashboard/users");
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
        <div>
        <div className='flex gap-x-64 w-full'>
            <div className='flex-1 flex items-center head'>User Management</div>
            <div className='items-center flex-none'><MdAccountCircle size={50}/></div>
        </div>
        <div className="className='w-full rounded-xl bg-white mt-6 p-6 shadow-md'">
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom style={{ fontFamily: "Montserrat" }}>
                        <strong>Add User Account</strong>
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
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: "20px",  fontFamily: "Montserrat", backgroundColor: "#003A55", color: "#FFFFFF" }}
                    >
                        Create Account
                    </Button>
                </form>
        </div>
    </div>
    );
}

export default AddUserAccount;