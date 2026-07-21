const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { cloudinary } = require('../config/cloudinary');

// @route  GET /api/courses  — public, all published courses
const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar')
      .select('-sections')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/courses/:id  — public, single course detail
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Hide video URLs for non-enrolled users (only show free lessons)
    // This gets handled in frontend based on enrollment status
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  POST /api/courses  — instructor only
const createCourse = async (req, res) => {
  try {
    const { title, description, category, level } = req.body;
    const course = await Course.create({
      title,
      description,
      category,
      level,
      instructor: req.user._id,
      thumbnail: req.file ? req.file.path : '',
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/courses/:id  — instructor only (own course)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, category, level, isPublished } = req.body;
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (level !== undefined) course.level = level;
    if (isPublished !== undefined) course.isPublished = isPublished;
    if (req.file) course.thumbnail = req.file.path;

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/courses/:id  — instructor/admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/courses/instructor/my  — instructor's own courses
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── SECTION MANAGEMENT ────────────────────────────────

// @route  POST /api/courses/:id/sections
const addSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title } = req.body;
    const order = course.sections.length + 1;
    course.sections.push({ title, order, lessons: [] });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/courses/:id/sections/:sectionId
const updateSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    if (req.body.title) section.title = req.body.title;
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/courses/:id/sections/:sectionId
const deleteSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.sections.pull({ _id: req.params.sectionId });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── LESSON MANAGEMENT ─────────────────────────────────

// @route  POST /api/courses/:id/sections/:sectionId/lessons
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const { title, description, duration, isFree } = req.body;
    const order = section.lessons.length + 1;

    const lesson = {
      title,
      description: description || '',
      duration:    duration    || 0,
      isFree:      isFree      || false,
      order,
      videoUrl:    req.file ? req.file.path       : '',
      publicId:    req.file ? req.file.filename   : '',
    };

    section.lessons.push(lesson);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/courses/:id/sections/:sectionId/lessons/:lessonId
const updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    const lesson = section.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const { title, description, duration, isFree } = req.body;
    if (title !== undefined)       lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (duration !== undefined)    lesson.duration = duration;
    if (isFree !== undefined)      lesson.isFree = isFree;
    if (req.file) {
      // Delete old video from cloudinary
      if (lesson.publicId) {
        await cloudinary.uploader.destroy(lesson.publicId, { resource_type: 'video' });
      }
      lesson.videoUrl = req.file.path;
      lesson.publicId = req.file.filename;
    }

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/courses/:id/sections/:sectionId/lessons/:lessonId
const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ message: 'Section not found' });
    const lesson = section.lessons.id(req.params.lessonId);
    if (lesson?.publicId) {
      await cloudinary.uploader.destroy(lesson.publicId, { resource_type: 'video' });
    }
    section.lessons.pull({ _id: req.params.lessonId });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCourses, getCourse, createCourse, updateCourse,
  deleteCourse, getMyCourses,
  addSection, updateSection, deleteSection,
  addLesson, updateLesson, deleteLesson,
};
