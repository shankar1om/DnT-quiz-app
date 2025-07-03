const resultRepository = require('../repository/result.repository');

const submitResult = async ({ user, quiz, answers }) => {
  const quizDoc = await resultRepository.findQuizById(quiz);
  if (!quizDoc) throw { status: 404, message: 'Quiz not found' };
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
  let result = await resultRepository.findResultByUserAndQuiz(user, quiz);
  if (result) {
    result.answers = answerDetails;
    result.score = score;
    result.correctCount = correctCount;
    result.wrongCount = wrongCount;
    result.attemptedCount = attemptedCount;
    result.submittedAt = new Date();
    await resultRepository.updateResult(result);
  } else {
    result = await resultRepository.createResult({
      user,
      quiz,
      answers: answerDetails,
      score,
      correctCount,
      wrongCount,
      attemptedCount
    });
    await resultRepository.findUserByIdAndUpdate(user, { $push: { quizzesTaken: result._id } });
  }
  return result;
};

const getUserResults = async (userId) => {
  return await resultRepository.findResultsByUser(userId);
};

const getQuizResultForUser = async (quizId, userId) => {
  const result = await resultRepository.findResultByQuizAndUser(quizId, userId);
  if (!result) throw { status: 404, message: 'Result not found' };
  return result;
};

const getAllUserProgress = async () => {
  const users = await resultRepository.findAllUsers();
  const quizzes = await resultRepository.findAllQuizzes();
  const results = await resultRepository.findAllResults();
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
  return leaderboard;
};

module.exports = {
  submitResult,
  getUserResults,
  getQuizResultForUser,
  getAllUserProgress
}; 