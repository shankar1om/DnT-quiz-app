const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    avatar: { type: String },
    quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
})

const User = mongoose.model("User",userSchema)
module.exports = User