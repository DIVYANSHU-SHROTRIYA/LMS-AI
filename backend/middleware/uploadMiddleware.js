const multer = require('multer');
const { thumbnailStorage, videoStorage, resourceStorage } = require('../config/cloudinary');

// Thumbnail upload (images)
const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  },
}).single('thumbnail');

// Video upload
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Only video files allowed'), false);
  },
}).single('video');

// Resource upload (PDFs etc)
const uploadResource = multer({
  storage: resourceStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
}).single('resource');

module.exports = { uploadThumbnail, uploadVideo, uploadResource };
