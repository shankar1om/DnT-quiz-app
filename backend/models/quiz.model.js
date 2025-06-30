const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    timeLimit: { type: Number }, // seconds for the whole quiz
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);

