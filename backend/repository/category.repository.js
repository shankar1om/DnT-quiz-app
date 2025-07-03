const Category = require('../models/category.model');
const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');

const createCategory = async (categoryData) => Category.create(categoryData);
const findAllCategories = async () => Category.find();
const updateCategoryById = async (id, update) => Category.findByIdAndUpdate(id, update, { new: true });
const deleteCategoryById = async (id) => Category.findByIdAndDelete(id);
const findQuizzesByCategory = async (categoryId) => Quiz.find({ category: categoryId });
const findQuestionsByQuizIds = async (quizIds) => Question.find({ quiz: { $in: quizIds } });

module.exports = {
  createCategory,
  findAllCategories,
  updateCategoryById,
  deleteCategoryById,
  findQuizzesByCategory,
  findQuestionsByQuizIds
}; 