const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repository/user.repository');
require('dotenv').config();

const createUser = async ({ username, email, password, avatar, role, gender }) => {
    let maleProfileAvatar;
    let femaleProfileAvatar;
    const user = await userRepository.findUserByEmail(email);
    if (user) {
        throw { status: 400, message: 'user already exist' };
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userRepository.createUser({
        username,
        email,
        password: hashedPassword,
        avatar: `${gender === 'male' ? maleProfileAvatar : femaleProfileAvatar}`,
        role,
        gender
    });
    return newUser;
};

const loginUser = async ({ email, password }) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw { status: 400, message: 'Invalid email or password' };
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        throw { status: 400, message: 'Invalid email or password', success: false };
    }
    const token = jwt.sign({ user: user }, process.env.SECERET_KEY, { expiresIn: '24h' });
    return { token, user };
};

const updateUser = async (email, { username, password, gender }) => {
    const updateFields = {};
    if (username) updateFields.username = username;
    if (gender) updateFields.gender = gender;
    if (password) {
        updateFields.password = bcrypt.hashSync(password, 10);
    }
    if (Object.keys(updateFields).length === 0) {
        throw { status: 400, message: 'No fields to update', success: false };
    }
    const updatedUser = await userRepository.updateUserByEmail(email, updateFields);
    if (!updatedUser) {
        throw { status: 404, message: 'User not found', success: false };
    }
    return updatedUser;
};

const getAllUsers = async () => {
    return await userRepository.getAllUsers();
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    getAllUsers
}; 