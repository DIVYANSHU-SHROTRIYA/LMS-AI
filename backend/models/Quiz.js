const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question:     { type: String, required: true },
  options:      [{ type: String, required: true }], // array of 4 strings
  correctIndex: { type: Number, required: true },   // 0-3
  topic:        { type: String, default: '' },       // for weak topic detection
  explanation:  { type: String, default: '' },       // shown after answer
});

const quizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  // Optional: link to a specific lesson
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  questions:   [questionSchema],
  passingScore:{ type: Number, default: 60 }, // percentage
  timeLimit:   { type: Number, default: 0 },  // minutes, 0 = no limit
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
