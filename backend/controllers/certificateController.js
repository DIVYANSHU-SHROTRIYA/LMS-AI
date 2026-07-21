const Certificate = require('../models/Certificate');
const Enrollment  = require('../models/Enrollment');
const Course      = require('../models/Course');
const generateCertificate = require('../utils/generateCertificate');
const { v4: uuidv4 } = require('crypto');

// @route  POST /api/certificates/generate/:courseId
const generateCert = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course:  courseId,
    });

    if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });
    if (enrollment.completionPercent < 100) {
      return res.status(400).json({ message: 'Complete all lessons first' });
    }

    // Check if already generated
    const existing = await Certificate.findOne({
      student: req.user._id,
      course:  courseId,
    });
    if (existing) return res.json(existing);

    const course = await Course.findById(courseId).populate('instructor', 'name');
    const certificateId = `LF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const pdfUrl = await generateCertificate({
      studentName:    req.user.name,
      courseName:     course.title,
      instructorName: course.instructor.name,
      certificateId,
      issuedAt:       new Date(),
    });

    const cert = await Certificate.create({
      student:       req.user._id,
      course:        courseId,
      enrollment:    enrollment._id,
      certificateId,
      pdfUrl,
    });

    // Save cert URL to enrollment too
    enrollment.certificateUrl = pdfUrl;
    await enrollment.save();

    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/certificates/my  — all certs for logged in student
const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user._id })
      .populate('course', 'title thumbnail category instructor')
      .sort({ issuedAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/certificates/verify/:certificateId  — public verify
const verifyCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('student', 'name')
      .populate('course', 'title');
    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid' });
    res.json({ valid: true, cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateCert, getMyCertificates, verifyCertificate };
