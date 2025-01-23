const router = require("express").Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

//Add a new user
router.post("/", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "User with given email already exists!" });

        //Generate an incrementing ID
        const lastUser = await UserModel.findOne().sort({ id: -1 }); //Get the user with the highest ID
        const newId = lastUser ? lastUser.id + 1 : 1; //Increment the ID or start at 1

        //Hash the password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create and save the new user
        const newUser = new UserModel({ id: newId, name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/change-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(500).json({ message: "Server error while updating password" });
    }
});


//Delete a user by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

//Fetch all users
router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 }); //Excluding password
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

module.exports = router;

