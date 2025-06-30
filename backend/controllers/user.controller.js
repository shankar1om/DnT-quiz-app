const User = require("../models/user.model.js")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();


const createUser = async (req, res) => {
    const { username, email, password, avatar, role, gender } = req.body;
    let maleProfileAvatar
    let femaleProfileAvatar //avatar website not working when it will work i will update.
    const user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({ message: "user already exist" })
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        const newUser = await User.create({ username, email, password: hashedPassword, avatar: `${gender === "male" ? maleProfileAvatar : femaleProfileAvatar}`, role, gender })
        res.status(201).json({
            message: "user sussessfully created",
            user: newUser
        })
    }
    catch (error) {
        console.log("error while creating usetr", error)
        res.status(500).json({
            message: "internal server error"
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password", succes: false });
        }
        const token = jwt.sign({ user: user }, process.env.SECERET_KEY, { expiresIn: '24h' })
        res.status(200).json({
            message: "Login successful",
            token,
            user,
            success: true
        });
    } catch (error) {
        console.log("error during user authentication", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

const validateToken = async (req, res) => {
    try {
        // The authMiddleware already validated the token, so if we reach here, it's valid
        res.status(200).json({
            message: "Token is valid",
            user: req.user,
            success: true
        });
    } catch (error) {
        console.log("error while validating token", error);
        res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
}

const updateUser = async (req, res) => {
    const email = req.user.email;
    const { username, password, gender } = req.body;
    try {
        const updateFields = {};
        if (username) updateFields.username = username;
        if (gender) updateFields.gender = gender;
        if (password) {
            updateFields.password = bcrypt.hashSync(password, 10);
        }
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update", success: false });
        }
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updateFields },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        return res.status(200).json({ message: "User updated successfully", user: updatedUser, success: true });
    } catch (error) {
        console.log("error while updating the user", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id username email role');
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error });
  }
};

module.exports = { createUser, loginUser, updateUser, validateToken, getAllUsers }