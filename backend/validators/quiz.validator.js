// Quiz Validators

function validateQuiz(req, res, next) {
    const { title, category, questions, difficulty } = req.body;
    if (!title || typeof title !== 'string' || title.length < 3) {
        return res.status(400).json({ message: 'Quiz title is required and must be at least 3 characters.' });
    }
    if (!category || typeof category !== 'string') {
        return res.status(400).json({ message: 'Category is required.' });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'At least one question is required.' });
    }
    if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
        return res.status(400).json({ message: 'Difficulty must be easy, medium, or hard.' });
    }
    next();
}

module.exports = { validateQuiz }; 