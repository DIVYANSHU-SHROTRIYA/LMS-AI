const Enrollment = require('../models/Enrollment');
const Course     = require('../models/Course');

// @route  POST /api/enrollments/:courseId  — student enrolls
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!course.isPublished) return res.status(400).json({ message: 'Course not published yet' });

    // Check already enrolled
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course:  req.params.courseId,
    });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    // Build initial progress array for all lessons
    const progress = [];
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        progress.push({ lessonId: lesson._id, completedAt: null, watchedPercent: 0 });
      });
    });

    const enrollment = await Enrollment.create({
      student:  req.user._id,
      course:   req.params.courseId,
      progress,
    });

    // Increment enrolled count
    await Course.findByIdAndUpdate(req.params.courseId, { $inc: { enrolledCount: 1 } });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/enrollments/my  — student's enrolled courses
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name avatar' },
      })
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/enrollments/:courseId  — check if enrolled + get progress
const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course:  req.params.courseId,
    });
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/enrollments/course/:courseId/students  — instructor sees enrolled students
const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email avatar')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { enrollCourse, getMyEnrollments, getEnrollment, getCourseStudents };
