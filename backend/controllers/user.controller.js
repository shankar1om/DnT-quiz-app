const userService = require('../services/user.service');

const createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({
            code: 201,
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            code: status,
            message: error.message || "Internal server error",
            error: error
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { token, user } = await userService.loginUser(req.body);
        res.status(200).json({
            code: 200,
            message: "Login successful",
            data: { token, user }
        });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({
            code: status,
            message: error.message || "Internal server error",
            error: error
        });
    }
};

const validateToken = async (req, res) => {
    try {
        res.status(200).json({
            code: 200,
            message: "Token is valid",
            data: req.user
        });
    } catch (error) {
        res.status(401).json({
            code: 401,
            message: "Invalid token",
            error: error
        });
    }
};

const updateUser = async (req, res) => {
    const email = req.user.email;
    try {
        const updatedUser = await userService.updateUser(email, req.body);
        return res.status(200).json({
            code: 200,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        const status = error.status || 500;
        return res.status(status).json({
            code: status,
            message: error.message || "Internal server error",
            error: error
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json({
            code: 200,
            message: "Users fetched successfully",
            metadata: { size: users.length },
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: 'Error fetching users',
            error: error
        });
    }
};

module.exports = { createUser, loginUser, updateUser, validateToken, getAllUsers };