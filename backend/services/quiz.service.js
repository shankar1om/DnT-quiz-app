const quizRepository = require('../repository/quiz.repository');
const { shuffleOptions } = require('../controllers/question.controller');

const createQuiz = async (quizData) => {
  return await quizRepository.createQuiz(quizData);
};

const getAllQuizzes = async (userId, query) => {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.difficulty) filter.difficulty = query.difficulty;
  const quizzes = await quizRepository.findQuizzes(filter);
  let userResults = [];
  if (userId) {
    userResults = await quizRepository.findResultsByUser(userId);
  }
  const resultMap = {};
  userResults.forEach(r => {
    resultMap[r.quiz.toString()] = r;
  });
  const quizzesWithStatus = quizzes.map(q => {
    const result = resultMap[q._id.toString()];
    const currentQuestionCount = q.questions.length;
    const answeredCount = result ? result.answers.length : 0;
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
  return quizzesWithStatus;
};

const getQuizById = async (id) => {
  const quiz = await quizRepository.findQuizById(id);
  if (!quiz) throw { status: 404, message: 'Quiz not found' };
  if (quiz.questions && Array.isArray(quiz.questions)) {
    quiz.questions = quiz.questions.map(q => {
      if (q.shuffleOptions && q.options && Array.isArray(q.options)) {
        const qCopy = q.toObject ? q.toObject() : { ...q };
        qCopy.options = shuffleOptions([...qCopy.options]);
        return qCopy;
      }
      return q;
    });
  }
  return quiz;
};

const updateQuiz = async (id, update) => {
  const quiz = await quizRepository.updateQuizById(id, update);
  if (!quiz) throw { status: 404, message: 'Quiz not found' };
  return quiz;
};

const deleteQuiz = async (id) => {
  const quiz = await quizRepository.deleteQuizById(id);
  if (!quiz) throw { status: 404, message: 'Quiz not found' };
  await quizRepository.deleteQuestionsByQuiz(id);
  const otherQuizzes = await quizRepository.findQuizzesByCategory(quiz.category);
  if (otherQuizzes.length === 0) {
    await quizRepository.deleteCategoryById(quiz.category);
  }
  return quiz;
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz
}; 