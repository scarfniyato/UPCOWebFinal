import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";   

const ChangePassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Ensure new password and confirm password match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            //Update API URL to match backend route
            const response = await axios.post("http://localhost:3001/api/users/change-password", {
                email,
                newPassword,
            });

            if (response.status === 200) {
                setSuccess("Password updated successfully!");
                setTimeout(() => navigate("/admin-dashboard"), 2000); //Redirect after 2 seconds
            }
        } catch (err) {
            console.error("Error:", err.response);
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <>
        <div className='flex gap-x-64 w-full'>
            <div className='flex-1 flex items-center head'>Account Management</div>
            <div className='items-center flex-none'><Link to="/accountmanagement"><MdAccountCircle size={50}/></Link></div>
        </div>
        <div className='w-full rounded-xl bg-white mt-6 p-6 shadow-md'>
                
                    <Typography variant="h6" gutterBottom style={{ fontFamily: "Montserrat" }}>
                        Manage Your Account Here!
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Enter email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            margin="normal"
                        />

                        <Typography variant="h6" gutterBottom style={{ fontFamily: "Montserrat" }}>
                            Change Password
                        </Typography>

                        <div className="fnormal">
                        <TextField
                            label="Enter new password"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            margin="normal"
                        />

                        <TextField
                            label="Confirm password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            margin="normal"
                        />
                        </div>

                        {error && (
                            <Typography color="error" variant="body2" style={{ marginTop: "10px" }}>
                                {error}
                            </Typography>
                        )}

                        {success && (
                            <Typography color="primary" variant="body2" style={{ marginTop: "10px" }}>
                                {success}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            style={{ marginTop: "20px",  fontFamily: "Montserrat", backgroundColor: "#003A55", color: "#FFFFFF" }}
                        >
                            Update Password
                        </Button>
                    </form>
        </div>
        </>
    );
};

export default ChangePassword;

