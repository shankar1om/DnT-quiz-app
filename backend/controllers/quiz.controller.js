// Quiz Controller
// NOTE: Replace require paths with actual model paths once models are implemented
const Quiz = require('../models/quiz.model');
const Category = require('../models/category.model');
const Question = require('../models/question.model.js');
const { shuffleOptions } = require('./question.controller');
const Result = require('../models/result.model');
const quizService = require('../services/quiz.service');

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const quiz = await quizService.createQuiz(req.body);
    res.status(201).json({
      code: 201,
      message: 'Quiz created successfully',
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error creating quiz',
      error: error
    });
  }
};

// Get all quizzes (with optional filters)
const getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user?._id;
    const quizzes = await quizService.getAllQuizzes(userId, req.query);
    res.status(200).json({
      code: 200,
      message: 'Quizzes fetched successfully',
      metadata: { size: quizzes.length },
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error fetching quizzes',
      error: error
    });
  }
};

// Get a quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id);
    res.status(200).json({
      code: 200,
      message: 'Quiz fetched successfully',
      data: quiz
    });
  } catch (error) {
    res.status(error.status || 404).json({
      code: error.status || 404,
      message: error.message || 'Quiz not found',
      error: error
    });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await quizService.updateQuiz(req.params.id, req.body);
    res.status(200).json({
      code: 200,
      message: 'Quiz updated successfully',
      data: quiz
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error updating quiz',
      error: error
    });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    await quizService.deleteQuiz(req.params.id);
    res.status(200).json({
      code: 200,
      message: 'Quiz and its questions deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error deleting quiz',
      error: error
    });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
}; 