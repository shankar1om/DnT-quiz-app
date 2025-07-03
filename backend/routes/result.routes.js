const express = require('express');
const router = express.Router();
const resultController = require('../controllers/result.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateResultSubmission } = require('../validators/result.validator');

// Submit a quiz attempt
router.post('/', authMiddleware(['user', 'admin']), validateResultSubmission, resultController.submitResult);
// Get all results for a user
router.get('/user/:userId', authMiddleware(['user', 'admin']), resultController.getUserResults);
// Get a user's result for a specific quiz
router.get('/quiz/:quizId/user/:userId', authMiddleware(['user', 'admin']), resultController.getQuizResultForUser);
// Get all user progress
router.get('/leaderboard', authMiddleware(['user', 'admin']), resultController.getAllUserProgress);

module.exports = router; 