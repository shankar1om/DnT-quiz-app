// Question Controller
// NOTE: Replace require paths with actual model paths once models are implemented
const Question = require('../models/question.model');
const Quiz = require('../models/quiz.model');
const questionService = require('../services/question.service');

// Add a question to a quiz
const addQuestion = async (req, res) => {
  try {
    const question = await questionService.addQuestion(req.params.quizId, req.body);
    // Add question to quiz's questions array
    await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: question._id } });
    res.status(201).json({
      code: 201,
      message: 'Question added successfully',
      data: question
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error adding question',
      error: error
    });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  try {
    const question = await questionService.updateQuestion(req.params.id, req.body);
    res.status(200).json({
      code: 200,
      message: 'Question updated successfully',
      data: question
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error updating question',
      error: error
    });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    await questionService.deleteQuestion(req.params.id);
    // Remove question from quiz's questions array
    await Quiz.findByIdAndUpdate(question.quiz, { $pull: { questions: question._id } });
    res.status(200).json({
      code: 200,
      message: 'Question deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error deleting question',
      error: error
    });
  }
};

// Shuffle answer options for a question (utility)
const shuffleOptions = questionService.shuffleOptions;

module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  shuffleOptions,
}; 