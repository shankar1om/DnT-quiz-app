const Result = require('../models/result.model');
const Quiz = require('../models/quiz.model');
const Question = require('../models/question.model');
const User = require('../models/user.model');

// Submit a quiz attempt
const submitResult = async (req, res) => {
  try {
    const { user, quiz, answers } = req.body;
    // Fetch all questions for the quiz
    const quizDoc = await Quiz.findById(quiz).populate('questions');
    if (!quizDoc) return res.status(404).json({ message: 'Quiz not found' });
    let correctCount = 0, wrongCount = 0, attemptedCount = 0;
    const answerDetails = answers.map(ans => {
      const question = quizDoc.questions.find(q => q._id.toString() === ans.question);
      let isCorrect = false;
      if (question) {
        attemptedCount++;
        if (question.type === 'mcq') {
          const correctOption = question.options.find(opt => opt.isCorrect);
          isCorrect = correctOption && correctOption.text === ans.selected;
        } else if (question.type === 'truefalse') {
          isCorrect = question.correctAnswer === ans.selected;
        }
        if (isCorrect) correctCount++; else wrongCount++;
      }
      return {
        question: ans.question,
        selected: ans.selected,
        isCorrect
      };
    });
    const score = correctCount;
    // Check if result already exists for this user and quiz
    let result = await Result.findOne({ user, quiz });
    if (result) {
      // Update existing result
      result.answers = answerDetails;
      result.score = score;
      result.correctCount = correctCount;
      result.wrongCount = wrongCount;
      result.attemptedCount = attemptedCount;
      result.submittedAt = new Date();
      await result.save();
    } else {
      // Create new result
      result = await Result.create({
        user,
        quiz,
        answers: answerDetails,
        score,
        correctCount,
        wrongCount,
        attemptedCount
      });
      // Optionally, push to user's quizzesTaken
      await User.findByIdAndUpdate(user, { $push: { quizzesTaken: result._id } });
    }
    res.status(201).json({ message: 'Result submitted', result });
  } catch (error) {
    console.log('Error in submitResult:', error);
    res.status(500).json({ message: 'Error submitting result', error });
  }
};

// Get all results for a user
const getUserResults = async (req, res) => {
  try {
    const userId = req.params.userId;
    const results = await Result.find({ user: userId }).populate('quiz').lean();
    console.log('Populated results:', results);
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user results', error });
  }
};

// Get a user's result for a specific quiz
const getQuizResultForUser = async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const result = await Result.findOne({ quiz: quizId, user: userId }).populate('quiz').lean();
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching result', error });
  }
};

const getAllUserProgress = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('_id username');
    const quizzes = await Quiz.find().select('_id');
    const results = await Result.find().select('user quiz');
    // Map userId to set of completed quizIds
    const userQuizMap = {};
    results.forEach(r => {
      if (!userQuizMap[r.user]) userQuizMap[r.user] = new Set();
      userQuizMap[r.user].add(r.quiz.toString());
    });
    const leaderboard = users.map(u => {
      const completed = userQuizMap[u._id]?.size || 0;
      const total = quizzes.length;
      const percent = total ? Math.round((completed / total) * 100) : 0;
      return { _id: u._id, username: u.username, completed, total, percent };
    });
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};

module.exports = {
  submitResult,
  getUserResults,
  getQuizResultForUser,
  getAllUserProgress
}; 