const Quiz        = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course      = require('../models/Course');

// @route  POST /api/quizzes  — instructor creates quiz
const createQuiz = async (req, res) => {
  try {
    const { courseId, lessonId, title, description, questions, passingScore, timeLimit } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const quiz = await Quiz.create({
      course: courseId,
      lesson: lessonId || null,
      title,
      description,
      questions,
      passingScore: passingScore || 60,
      timeLimit:    timeLimit    || 0,
    });

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/quizzes/course/:courseId  — get all quizzes for a course
const getCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/quizzes/:id  — get single quiz (hide correct answers for students)
const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Students don't see correct answers before attempting
    if (req.user.role === 'student') {
      const safeQuiz = quiz.toObject();
      safeQuiz.questions = safeQuiz.questions.map(q => ({
        ...q,
        correctIndex: undefined,
        explanation:  undefined,
      }));
      return res.json(safeQuiz);
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/quizzes/:id  — instructor updates quiz
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/quizzes/:id
const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  POST /api/quizzes/:id/submit  — student submits answers
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    // answers = [{ questionId, selectedIndex }]

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Evaluate answers
    let correct = 0;
    const evaluated = answers.map(ans => {
      const question = quiz.questions.id(ans.questionId);
      if (!question) return null;
      const isCorrect = question.correctIndex === ans.selectedIndex;
      if (isCorrect) correct++;
      return {
        questionId:    ans.questionId,
        selectedIndex: ans.selectedIndex,
        isCorrect,
        topic:         question.topic || '',
      };
    }).filter(Boolean);

    const score   = Math.round((correct / quiz.questions.length) * 100);
    const passed  = score >= quiz.passingScore;

    // Detect weak topics (topics where answer was wrong)
    const weakTopics = [...new Set(
      evaluated
        .filter(a => !a.isCorrect && a.topic)
        .map(a => a.topic)
    )];

    const attempt = await QuizAttempt.create({
      student:        req.user._id,
      quiz:           quiz._id,
      course:         quiz.course,
      answers:        evaluated,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers: correct,
      passed,
      timeTaken:      timeTaken || 0,
      weakTopics,
    });

    // Return with correct answers + explanations
    const result = attempt.toObject();
    result.questions = quiz.questions;

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/quizzes/:id/attempts  — student's attempts for a quiz
const getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user._id,
      quiz:    req.params.id,
    }).sort({ attemptedAt: -1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/quizzes/course/:courseId/attempts  — all attempts for weak topic summary
const getCourseAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      student: req.user._id,
      course:  req.params.courseId,
    }).sort({ attemptedAt: -1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createQuiz, getCourseQuizzes, getQuiz, updateQuiz,
  deleteQuiz, submitQuiz, getMyAttempts, getCourseAttempts,
};
