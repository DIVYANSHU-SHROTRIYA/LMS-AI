const express = require('express');
const router  = express.Router();
const {
  createQuiz, getCourseQuizzes, getQuiz, updateQuiz,
  deleteQuiz, submitQuiz, getMyAttempts, getCourseAttempts,
} = require('../controllers/quizController');
const { protect, roleGuard } = require('../middleware/authMiddleware');

router.post('/',                                protect, roleGuard('instructor', 'admin'), createQuiz);
router.get ('/course/:courseId',               protect, getCourseQuizzes);
router.get ('/course/:courseId/attempts',      protect, getCourseAttempts);
router.get ('/:id',                            protect, getQuiz);
router.put ('/:id',                            protect, roleGuard('instructor', 'admin'), updateQuiz);
router.delete('/:id',                          protect, roleGuard('instructor', 'admin'), deleteQuiz);
router.post('/:id/submit',                     protect, roleGuard('student'), submitQuiz);
router.get ('/:id/attempts',                   protect, getMyAttempts);

module.exports = router;
