const Enrollment = require('../models/Enrollment');
const Course     = require('../models/Course');

// @route  PUT /api/progress/:courseId/lessons/:lessonId  — mark lesson complete
const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { watchedPercent } = req.body;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course:  courseId,
    });
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled in this course' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Find or create progress entry for this lesson
    const lessonProgress = enrollment.progress.find(
      p => p.lessonId.toString() === lessonId
    );

    if (lessonProgress) {
      lessonProgress.watchedPercent = watchedPercent || 100;
      if (watchedPercent >= 80 && !lessonProgress.completedAt) {
        lessonProgress.completedAt = new Date();
      }
    } else {
      enrollment.progress.push({
        lessonId,
        watchedPercent: watchedPercent || 100,
        completedAt:    watchedPercent >= 80 ? new Date() : null,
      });
    }

    // Recalculate overall completion
    const completed = enrollment.progress.filter(p => p.completedAt !== null).length;
    enrollment.completionPercent = course.totalLessons > 0
      ? Math.round((completed / course.totalLessons) * 100)
      : 0;

    if (enrollment.completionPercent === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json({ completionPercent: enrollment.completionPercent, enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/progress/:courseId  — get full progress for a course
const getCourseProgress = async (req, res) => {
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

module.exports = { markLessonComplete, getCourseProgress };
