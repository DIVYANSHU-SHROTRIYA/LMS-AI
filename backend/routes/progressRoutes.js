const express = require('express');
const router  = express.Router();
const { markLessonComplete, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:courseId/lessons/:lessonId', protect, markLessonComplete);
router.get('/:courseId',                   protect, getCourseProgress);

module.exports = router;
