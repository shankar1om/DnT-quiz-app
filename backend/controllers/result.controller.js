const resultService = require('../services/result.service');

// Submit a quiz attempt
const submitResult = async (req, res) => {
  try {
    const result = await resultService.submitResult(req.body);
    res.status(201).json({
      code: 201,
      message: 'Result submitted',
      data: result
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error submitting result',
      error: error
    });
  }
};

// Get all results for a user
const getUserResults = async (req, res) => {
  try {
    const results = await resultService.getUserResults(req.params.userId);
    res.status(200).json({
      code: 200,
      message: 'User results fetched successfully',
      metadata: { size: results.length },
      data: results
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error fetching user results',
      error: error
    });
  }
};

// Get a user's result for a specific quiz
const getQuizResultForUser = async (req, res) => {
  try {
    const result = await resultService.getQuizResultForUser(req.params.quizId, req.params.userId);
    res.status(200).json({
      code: 200,
      message: 'Quiz result fetched successfully',
      data: result
    });
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.status || 500,
      message: 'Error fetching result',
      error: error
    });
  }
};

const getAllUserProgress = async (req, res) => {
  try {
    const leaderboard = await resultService.getAllUserProgress();
    res.status(200).json({
      code: 200,
      message: 'Leaderboard fetched successfully',
      metadata: { size: leaderboard.length },
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: 'Error fetching leaderboard',
      error: error
    });
  }
};

module.exports = {
  submitResult,
  getUserResults,
  getQuizResultForUser,
  getAllUserProgress
}; 