const express = require('express');
const router  = express.Router();
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { protect, roleGuard } = require('../middleware/authMiddleware');
const { uploadThumbnail } = require('../middleware/uploadMiddleware');
const User = require('../models/User');

router.post('/register', register);
router.post('/login',    login);
router.get ('/me',       protect, getMe);
router.put ('/me',       protect, uploadThumbnail, updateMe);

// Admin — get all users
router.get('/admin/users', protect, roleGuard('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin — delete user
router.delete('/admin/users/:id', protect, roleGuard('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
