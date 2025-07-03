const Quiz = require('../models/quiz.model');
const Category = require('../models/category.model');
const Question = require('../models/question.model');
const Result = require('../models/result.model');

const createQuiz = async (quizData) => Quiz.create(quizData);
const findQuizzes = async (filter) => Quiz.find(filter).populate('category').populate('questions').lean();
const findQuizById = async (id) => Quiz.findById(id).populate('category').populate('questions').lean();
const updateQuizById = async (id, update) => Quiz.findByIdAndUpdate(id, update, { new: true });
const deleteQuizById = async (id) => Quiz.findByIdAndDelete(id);
const deleteQuestionsByQuiz = async (quizId) => Question.deleteMany({ quiz: quizId });
const findQuizzesByCategory = async (categoryId) => Quiz.find({ category: categoryId });
const deleteCategoryById = async (categoryId) => Category.findByIdAndDelete(categoryId);
const findResultsByUser = async (userId) => Result.find({ user: userId }).lean();

module.exports = {
  createQuiz,
  findQuizzes,
  findQuizById,
  updateQuizById,
  deleteQuizById,
  deleteQuestionsByQuiz,
  findQuizzesByCategory,
  deleteCategoryById,
  findResultsByUser
}; 