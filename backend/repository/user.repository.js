const User = require('../models/user.model');

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const createUser = async (userData) => {
    return await User.create(userData);
};

const updateUserByEmail = async (email, updateFields) => {
    return await User.findOneAndUpdate(
        { email },
        { $set: updateFields },
        { new: true }
    );
};

const getAllUsers = async () => {
    return await User.find().select('_id username email role');
};

module.exports = {
    findUserByEmail,
    createUser,
    updateUserByEmail,
    getAllUsers
}; 