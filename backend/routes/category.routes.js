const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateCategory } = require('../validators/category.validator');

// Create a new category
router.post('/', authMiddleware(['admin']), validateCategory, categoryController.createCategory);

// Get all categories (public)
router.get('/', categoryController.getAllCategories);

// Update a category
router.put('/:id', authMiddleware(['admin']), validateCategory, categoryController.updateCategory);

// Delete a category
router.delete('/:id', authMiddleware(['admin']), categoryController.deleteCategory);

// Get all questions for a category (public)
router.get('/:id/questions', categoryController.getQuestionsForCategory);

module.exports = router; 