const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new quiz
router.post('/', authMiddleware(['admin']), quizController.createQuiz);

// Get all quizzes (admins and users)
router.get('/', authMiddleware(['user', 'admin']), quizController.getAllQuizzes);

// Get a quiz by ID
router.get('/:id', authMiddleware(['user', 'admin']), quizController.getQuizById);

// Update a quiz
router.put('/:id', authMiddleware(['admin']), quizController.updateQuiz);

// Delete a quiz
router.delete('/:id', authMiddleware(['admin']), quizController.deleteQuiz);

module.exports = router; 