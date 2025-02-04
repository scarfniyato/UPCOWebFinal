import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
import { MdAccountCircle } from "react-icons/md";
import { Link } from "react-router-dom";

const UserManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            //will fetch data from backend
            const response = await axios.get("http://localhost:3001/api/users");
            console.log("Fetched accounts:", response.data); //debug log
            setAccounts(response.data); //will update state with the fetched accounts
        } catch (error) {
            console.error("Error fetching accounts:", error.response?.data || error);
        }
    };

    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/users/${selectedUserId}`);
            setAccounts(accounts.filter((account) => account._id !== selectedUserId));
            setOpenDialog(false);
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedUserId(null);
    };

    useEffect(() => {
        fetchAccounts();
        const interval = setInterval(fetchAccounts, 30000); //will refresh page every 30s
        return () => clearInterval(interval); //will cleanup interval on unmount
    }, []);

    const formatDate = (dateString) => {
        //for "Data Created" column
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(dateString));
    };

    return (
<div className="text-xs">
            {/* Header */}
            <header className="flex justify-between items-center w-full bg-white p-3 shadow-md rounded-lg">
                <h1 className="text-lg font-semibold text-[#333333]">User Management</h1>
                <Link to="/dashboard/accounts" className="flex items-center space-x-2">
                    <MdAccountCircle size={40} className="text-gray-700 hover:text-green-500 transition duration-300" />
                </Link>
            </header>

            {/* User Table */}
            <div className="bg-white mt-4 p-6 rounded-xl shadow-md text-xs">
                <div className="mb-4 text-right">
                    <Link to="/dashboard/index">
                        <Button
                        style={{background:"#003f68"}}
                            variant="contained"
                            className="text-xs bg-[#003f68] text-white hover:bg-[#003f68] text-xs" // Custom color and hover effect
                        >
                            Add Account
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <Table className="text-xs w-full">
                        <TableHead>
                            <TableRow className="bg-gray-200">
                                <TableCell className="text-xs">Name</TableCell>
                                <TableCell className="text-xs">Email</TableCell>
                                <TableCell className="text-xs">Date Created</TableCell>
                                <TableCell className="text-xs">Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {accounts.length > 0 ? (
                                accounts.map((account) => (
                                    <TableRow key={account._id}>
                                        <TableCell>{account.name}</TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>{formatDate(account.createdAt)}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleDeleteClick(account._id)} color="secondary" variant="outlined" size="small">
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No accounts found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDialog} onClose={handleCancelDelete}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this account? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete} style={{color:"#003f68"}}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary">
                            Delete Account
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default UserManagement;


