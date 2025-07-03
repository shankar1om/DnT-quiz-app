const questionRepository = require('../repository/question.repository');

const addQuestion = async (quizId, questionData) => {
  const question = await questionRepository.createQuestion({ ...questionData, quiz: quizId });
  await questionRepository.addQuestionToQuiz(quizId, question._id);
  return question;
};

const updateQuestion = async (id, update) => {
  const question = await questionRepository.updateQuestionById(id, update);
  if (!question) throw { status: 404, message: 'Question not found' };
  return question;
};

const deleteQuestion = async (id) => {
  const question = await questionRepository.deleteQuestionById(id);
  if (!question) throw { status: 404, message: 'Question not found' };
  await questionRepository.removeQuestionFromQuiz(question.quiz, question._id);
  return question;
};

// Utility: Shuffle answer options for a question
const shuffleOptions = (options) => {
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