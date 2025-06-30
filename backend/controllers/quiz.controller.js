// Quiz Controller
// NOTE: Replace require paths with actual model paths once models are implemented
const Quiz = require('../models/quiz.model');
const Category = require('../models/category.model');
const Question = require('../models/question.model.js');
const { shuffleOptions } = require('./question.controller');
const Result = require('../models/result.model');

// Create a new quiz
const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error creating quiz', error });
  }
};

// Get all quizzes (with optional filters)
const getAllQuizzes = async (req, res) => {
  try {
    const userId = req.user?._id;
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    const quizzes = await Quiz.find(filter).populate('category').populate('questions').lean();

    let userResults = [];
    if (userId) {
      userResults = await Result.find({ user: userId }).lean();
    }

    // Map quizId to result for quick lookup
    const resultMap = {};
    userResults.forEach(r => {
      resultMap[r.quiz.toString()] = r;
    });

    const quizzesWithStatus = quizzes.map(q => {
      const result = resultMap[q._id.toString()];
      const currentQuestionCount = q.questions.length;
      const answeredCount = result ? result.answers.length : 0;
      // If user has a result, but there are new questions, status is 'pending'
      let status = 'pending';
      if (result && answeredCount === currentQuestionCount && currentQuestionCount > 0) {
        status = 'completed';
      }
      return {
        ...q,
        userResult: result ? {
          _id: result._id,
          answeredCount,
          score: result.score,
          attemptedCount: result.attemptedCount,
          correctCount: result.correctCount,
          wrongCount: result.wrongCount,
          submittedAt: result.submittedAt
        } : null,
        currentQuestionCount,
        status
      };
    });

    res.status(200).json({ quizzes: quizzesWithStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error });
  }
};

// Get a quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('category').populate('questions').lean();
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    // Shuffle options for questions with shuffleOptions true
    if (quiz.questions && Array.isArray(quiz.questions)) {
      quiz.questions = quiz.questions.map(q => {
        if (q.shuffleOptions && q.options && Array.isArray(q.options)) {
          // Clone question to avoid mutating DB doc
          const qCopy = q.toObject ? q.toObject() : { ...q };
          qCopy.options = shuffleOptions([...qCopy.options]);
          return qCopy;
        }
        return q;
      });
    }
    res.status(200).json({ quiz });
  } catch (error) {
    res.status(404).json({ message: 'Quiz not found', error });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.status(200).json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error updating quiz', error });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    // Optionally, delete all questions associated with this quiz
    await Question.deleteMany({ quiz: req.params.id });
    // Check if the category has any other quizzes (after deletion)
    const otherQuizzes = await Quiz.find({ category: quiz.category });
    if (otherQuizzes.length === 0) {
      await Category.findByIdAndDelete(quiz.category);
    }
    res.status(200).json({ message: 'Quiz and its questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting quiz', error });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
}; 