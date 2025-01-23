const crypto = require("crypto");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User"); // Fixed import
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmails");

router.post("/send-reset-email", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).send({ message: "User with this email does not exist" });

        const resetToken = crypto.randomBytes(32).toString("hex");
        const token = new Token({ userId: user._id, token: resetToken });
        await token.save();

        const resetLink = `${process.env.FRONTEND_URL}/password-reset/${user._id}/${resetToken}`;
        await sendEmail(user.email, "Password Reset Request", `Click here to reset your password: ${resetLink}`);
        res.status(200).send({ message: "Reset password link sent to your email." });
    } catch (error) {
        console.error("Error in sending reset email:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

router.post("/:userId/:token", async (req, res) => {
    try {
        const { userId, token } = req.params;
        const { password } = req.body;

        const tokenRecord = await Token.findOne({ userId, token });
        if (!tokenRecord) return res.status(400).send({ message: "Invalid or expired token" });

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).send({ message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save({ validateModifiedOnly: true });

        await tokenRecord.deleteOne();
        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetting password:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;

