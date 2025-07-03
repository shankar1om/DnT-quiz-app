const express = require('express');
const router = express.Router();
const { createUser, loginUser, updateUser, validateToken, getAllUsers } = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateSignup, validateLogin, validateUpdateProfile } = require('../validators/user.validator');

// User signup route
router.post('/signup', validateSignup, createUser);

// User login route
router.post('/login', validateLogin, loginUser);

// Get all users
router.get('/', authMiddleware(), getAllUsers);

// Validate token route (protected)
router.get('/validate', authMiddleware(), validateToken);

// Update user profile (protected)
router.put('/profile', authMiddleware(), validateUpdateProfile, updateUser);

module.exports = router;
