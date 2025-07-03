// Category Controller
// NOTE: Replace require paths with actual model paths once models are implemented
const Category = require('../models/category.model');
const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');
const categoryService = require('../services/category.service');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
      code: 201,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error creating category',
      error: error
    });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      code: 200,
      message: 'Categories fetched successfully',
      metadata: { size: categories.length },
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error fetching categories',
      error: error
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({
      code: 200,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error updating category',
      error: error
    });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
      code: 200,
      message: 'Category deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error deleting category',
      error: error
    });
  }
};

// Get all questions for a category
const getQuestionsForCategory = async (req, res) => {
  try {
    const questions = await categoryService.getQuestionsForCategory(req.params.id);
    res.status(200).json({
      code: 200,
      message: 'Questions fetched successfully',
      metadata: { size: questions.length },
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error fetching questions for category',
      error: error
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getQuestionsForCategory,
}; 