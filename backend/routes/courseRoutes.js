const express = require('express');
const router  = express.Router();
const {
  getAllCourses, getCourse, createCourse, updateCourse, deleteCourse, getMyCourses,
  addSection, updateSection, deleteSection,
  addLesson, updateLesson, deleteLesson,
} = require('../controllers/courseController');
const { protect, roleGuard } = require('../middleware/authMiddleware');
const { uploadThumbnail, uploadVideo } = require('../middleware/uploadMiddleware');

// Public
router.get('/',    getAllCourses);
router.get('/:id', getCourse);

// Instructor
router.get ('/instructor/my', protect, roleGuard('instructor', 'admin'), getMyCourses);
router.post('/',              protect, roleGuard('instructor', 'admin'), uploadThumbnail, createCourse);
router.put ('/:id',           protect, roleGuard('instructor', 'admin'), uploadThumbnail, updateCourse);
router.delete('/:id',         protect, roleGuard('instructor', 'admin'), deleteCourse);

// Sections
router.post  ('/:id/sections',                  protect, roleGuard('instructor', 'admin'), addSection);
router.put   ('/:id/sections/:sectionId',       protect, roleGuard('instructor', 'admin'), updateSection);
router.delete('/:id/sections/:sectionId',       protect, roleGuard('instructor', 'admin'), deleteSection);

// Lessons
router.post  ('/:id/sections/:sectionId/lessons',                    protect, roleGuard('instructor', 'admin'), uploadVideo, addLesson);
router.put   ('/:id/sections/:sectionId/lessons/:lessonId',          protect, roleGuard('instructor', 'admin'), uploadVideo, updateLesson);
router.delete('/:id/sections/:sectionId/lessons/:lessonId',          protect, roleGuard('instructor', 'admin'), deleteLesson);

module.exports = router;
