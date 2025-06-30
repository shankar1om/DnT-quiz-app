// Category Controller
// NOTE: Replace require paths with actual model paths once models are implemented
const Category = require('../models/category.model');
const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');

// Create a new category
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};

// Get all questions for a category
const getQuestionsForCategory = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ category: req.params.id });
    const quizIds = quizzes.map(q => q._id);
    const questions = await Question.find({ quiz: { $in: quizIds } });
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions for category', error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getQuestionsForCategory,
}; 