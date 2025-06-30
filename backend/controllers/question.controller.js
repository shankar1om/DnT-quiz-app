// Question Controller
// NOTE: Replace require paths with actual model paths once models are implemented
const Question = require('../models/question.model');
const Quiz = require('../models/quiz.model');

// Add a question to a quiz
const addQuestion = async (req, res) => {
  try {
    const question = await Question.create({ ...req.body, quiz: req.params.quizId });
    // Add question to quiz's questions array
    await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: question._id } });
    res.status(201).json({ message: 'Question added successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error adding question', error });
  }
};

// Update a question
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question updated successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Error updating question', error });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    // Remove question from quiz's questions array
    await Quiz.findByIdAndUpdate(question.quiz, { $pull: { questions: question._id } });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
};

// Shuffle answer options for a question (utility)
const shuffleOptions = (options) => {
  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
};

module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  shuffleOptions,
}; 