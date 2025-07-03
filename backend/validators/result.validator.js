// Result Validators

function validateResultSubmission(req, res, next) {
    const { user, quiz, answers } = req.body;
    if (!user || typeof user !== 'string') {
        return res.status(400).json({ message: 'User ID is required.' });
    }
    if (!quiz || typeof quiz !== 'string') {
        return res.status(400).json({ message: 'Quiz ID is required.' });
    }
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: 'At least one answer is required.' });
    }
    next();
}

module.exports = { validateResultSubmission }; 