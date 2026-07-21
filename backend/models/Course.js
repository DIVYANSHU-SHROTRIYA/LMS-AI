const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  videoUrl:    { type: String, default: '' },   // Cloudinary video URL
  publicId:    { type: String, default: '' },   // Cloudinary public_id for deletion
  duration:    { type: Number, default: 0 },    // in minutes
  order:       { type: Number, required: true },
  resources: [{
    name: String,
    url:  String,
  }],
  isFree:      { type: Boolean, default: false },
}, { timestamps: true });

const sectionSchema = new mongoose.Schema({
  title:   { type: String, required: true, trim: true },
  order:   { type: Number, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thumbnail:  { type: String, default: '' },
  category: {
    type: String,
    enum: ['Web Dev', 'Data Science', 'Cloud', 'Design', 'Mobile', 'DevOps', 'AI/ML', 'Other'],
    default: 'Other',
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  sections:    [sectionSchema],
  isPublished: { type: Boolean, default: false },
  totalLessons:{ type: Number, default: 0 },
  totalDuration:{ type: Number, default: 0 }, // in minutes
  enrolledCount:{ type: Number, default: 0 },
  rating:      { type: Number, default: 0 },
}, { timestamps: true });

// Auto-calculate totals before saving
courseSchema.pre('save', function (next) {
  let lessons = 0;
  let duration = 0;
  this.sections.forEach(section => {
    lessons += section.lessons.length;
    section.lessons.forEach(l => { duration += l.duration || 0; });
  });
  this.totalLessons = lessons;
  this.totalDuration = duration;
  next();
});

module.exports = mongoose.model('Course', courseSchema);
