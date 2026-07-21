const mongoose = require('mongoose');

const lessonProgressSchema = new mongoose.Schema({
  lessonId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  completedAt: { type: Date, default: null },
  watchedPercent: { type: Number, default: 0 }, // 0-100
}, { _id: false });

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrolledAt:        { type: Date, default: Date.now },
  completionPercent: { type: Number, default: 0 },
  completedAt:       { type: Date, default: null },
  certificateUrl:    { type: String, default: '' },
  progress:          [lessonProgressSchema],
}, { timestamps: true });

// Unique: one enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Auto-calculate completion percent
enrollmentSchema.methods.updateProgress = async function (totalLessons) {
  const completed = this.progress.filter(p => p.completedAt !== null).length;
  this.completionPercent = totalLessons > 0
    ? Math.round((completed / totalLessons) * 100)
    : 0;
  if (this.completionPercent === 100 && !this.completedAt) {
    this.completedAt = new Date();
  }
  await this.save();
  return this.completionPercent;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
