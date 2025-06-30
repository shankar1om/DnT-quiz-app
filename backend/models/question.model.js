const mongoose = require('mongoose')

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  type: { type: String, enum: ['mcq', 'truefalse'], required: true },
  text: { type: String, required: true },
  options: [optionSchema], // For MCQ
  correctAnswer: { type: String }, // For True/False or direct answer
  media: { type: String }, // URL to image/video
  timeLimit: { type: Number }, // seconds for this question (optional)
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  shuffleOptions: { type: Boolean, default: false },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question