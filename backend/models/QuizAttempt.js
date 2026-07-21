const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedIndex: { type: Number, required: true },  // what student chose
  isCorrect:     { type: Boolean, required: true },
  topic:         { type: String, default: '' },
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  answers:        [answerSchema],
  score:          { type: Number, required: true }, // percentage 0-100
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  passed:         { type: Boolean, required: true },
  attemptedAt:    { type: Date, default: Date.now },
  timeTaken:      { type: Number, default: 0 }, // seconds
  weakTopics:     [String], // AI-detected weak topics
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
