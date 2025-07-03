const Result = require('../models/result.model');
const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');
const User = require('../models/user.model');

const findQuizById = async (quizId) => Quiz.findById(quizId).populate('questions');
const findResultByUserAndQuiz = async (user, quiz) => Result.findOne({ user, quiz });
const createResult = async (resultData) => Result.create(resultData);
const updateResult = async (result) => result.save();
const findUserByIdAndUpdate = async (userId, update) => User.findByIdAndUpdate(userId, update);
const findResultsByUser = async (userId) => Result.find({ user: userId }).populate('quiz').lean();
const findResultByQuizAndUser = async (quizId, userId) => Result.findOne({ quiz: quizId, user: userId }).populate('quiz').lean();
const findAllUsers = async () => User.find({ role: 'user' }).select('_id username');
const findAllQuizzes = async () => Quiz.find().select('_id');
const findAllResults = async () => Result.find().select('user quiz');

module.exports = {
  findQuizById,
  findResultByUserAndQuiz,
  createResult,
  updateResult,
  findUserByIdAndUpdate,
  findResultsByUser,
  findResultByQuizAndUser,
  findAllUsers,
  findAllQuizzes,
  findAllResults
}; 