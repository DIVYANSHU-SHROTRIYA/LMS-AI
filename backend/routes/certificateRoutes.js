const express = require('express');
const router  = express.Router();
const { generateCert, getMyCertificates, verifyCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate/:courseId',    protect, generateCert);
router.get ('/my',                    protect, getMyCertificates);
router.get ('/verify/:certificateId',          verifyCertificate); // public

module.exports = router;
