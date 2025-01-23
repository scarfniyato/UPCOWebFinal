import React, { useEffect, useState } from "react";
import axios from "axios";
import {Table,TableBody,TableCell,TableHead,TableRow,Typography,Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,} from "@mui/material";

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
        <div>
            <div>
                <h1>User Management</h1>
                <Button href="/admin-dashboard/user-management/addAccount">Add Account</Button>
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Date Created</TableCell> {/* New column */}
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow key={account._id}>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>{formatDate(account.createdAt)}</TableCell> {/* Display formatted date */}
                            <TableCell>
                                <Button onClick={() => handleDeleteClick(account._id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openDialog} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} >Cancel</Button>
                    <Button onClick={handleConfirmDelete} >Delete this account</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserManagement;


