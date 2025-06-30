const express = require('express');
const router = express.Router();
const { createUser, loginUser, updateUser, validateToken, getAllUsers } = require('../controllers/user.controller.js');
const authMiddleware = require('../middlewares/authMiddleware');

// User signup route
router.post('/signup', createUser);

// User login route
router.post('/login', loginUser);

// Get all users
router.get('/', authMiddleware(), getAllUsers);

// Validate token route (protected)
router.get('/validate', authMiddleware(), validateToken);

// Update user profile (protected)
router.put('/profile', authMiddleware(), updateUser);

module.exports = router;
