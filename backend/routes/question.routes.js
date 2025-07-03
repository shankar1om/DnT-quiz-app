const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateQuestion } = require('../validators/question.validator');

// Add a question to a quiz
router.post('/:quizId', authMiddleware(['admin']), validateQuestion, questionController.addQuestion);

// Update a question
router.put('/:id', authMiddleware(['admin']), validateQuestion, questionController.updateQuestion);

// Delete a question
router.delete('/:id', authMiddleware(['admin']), questionController.deleteQuestion);

module.exports = router; 