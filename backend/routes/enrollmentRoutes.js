const express = require('express');
const router  = express.Router();
const { enrollCourse, getMyEnrollments, getEnrollment, getCourseStudents } = require('../controllers/enrollmentController');
const { protect, roleGuard } = require('../middleware/authMiddleware');

router.post('/:courseId',                          protect, roleGuard('student'), enrollCourse);
router.get ('/my',                                 protect, roleGuard('student'), getMyEnrollments);
router.get ('/:courseId',                          protect, getEnrollment);
router.get ('/course/:courseId/students',          protect, roleGuard('instructor', 'admin'), getCourseStudents);

module.exports = router;
