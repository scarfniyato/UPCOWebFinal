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
            {/* Header */}
            <header className="flex justify-between items-center w-full bg-white p-3 shadow-md rounded-lg">
                <h1 className="text-lg font-semibold text-[#333333]">
                    User Management
                </h1>
                <Link to="/dashboard/accounts" className="flex items-center space-x-2">
                    <MdAccountCircle size={40} className="text-gray-700 hover:text-green-500 transition duration-300" />
                </Link>
            </header>
            <div className='w-full rounded-lg bg-white mt-4 p-6 shadow-md text-xs'>
                <form onSubmit={handleSubmit}>
                    <div className='fbold mb-3 text-sm'>Add Account<hr /></div>
                    <TextField
                        onChange={(e) => setName(e.target.value)}
                        name="name"
                        required
                        className="inputField h-10"
                        style={row}
                        label="Enter Name"
                        type="text"
                    />
                    <TextField
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        required
                        className="inputField h-10"
                        style={row}
                        label="Enter Email"
                        type="email"
                    />
                    <TextField
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        required
                        className="inputField "
                        fullWidth
                        style={row}
                        label="Enter Password"
                        type="password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{ marginTop: "20px", fontFamily: "Montserrat", backgroundColor: "#003A55", color: "#FFFFFF" }}
                    >
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default AddUserAccount;