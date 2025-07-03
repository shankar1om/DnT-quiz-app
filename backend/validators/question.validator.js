// Question Validators

function validateQuestion(req, res, next) {
    const { text, options, type } = req.body;
    if (!text || typeof text !== 'string' || text.length < 5) {
        return res.status(400).json({ message: 'Question text is required and must be at least 5 characters.' });
    }
    if (!type || !['mcq', 'truefalse'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either mcq or truefalse.' });
    }
    if (type === 'mcq') {
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: 'At least two options are required for MCQ.' });
        }
        const correctOptions = options.filter(opt => opt.isCorrect);
        if (correctOptions.length !== 1) {
            return res.status(400).json({ message: 'Exactly one correct option is required for MCQ.' });
        }
    }
    next();
}

module.exports = { validateQuestion }; 