const router = require("express").Router();
const UserModel = require("../models/User"); 
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

//Login route
router.post("/admin-login", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) return res.status(401).send({ message: "Invalid Email or Password" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send({ message: "Invalid Email or Password" });

        //Update lastActive to current timestamp
        user.lastActive = new Date();
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({ data: token, userId: user._id, message: "Logged in successfully" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


//Logout route
router.post("/", async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).send({ message: "User ID is required" });

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).send({ message: "User not found" });

        //Update lastActive field to now
        user.lastActive = new Date();
        await user.save();

        res.status(200).send({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

//Validation function
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;

