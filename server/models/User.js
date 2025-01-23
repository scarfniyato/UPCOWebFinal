const mongoose = require("mongoose");

//Account User schema
const UserSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // Added creation date
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;


