const Question = require('../models/question.model');
const Quiz = require('../models/quiz.model');

const createQuestion = async (questionData) => Question.create(questionData);
const addQuestionToQuiz = async (quizId, questionId) => Quiz.findByIdAndUpdate(quizId, { $push: { questions: questionId } });
const updateQuestionById = async (id, update) => Question.findByIdAndUpdate(id, update, { new: true });
const deleteQuestionById = async (id) => Question.findByIdAndDelete(id);
const removeQuestionFromQuiz = async (quizId, questionId) => Quiz.findByIdAndUpdate(quizId, { $pull: { questions: questionId } });

module.exports = {
  createQuestion,
  addQuestionToQuiz,
  updateQuestionById,
  deleteQuestionById,
  removeQuestionFromQuiz
}; 