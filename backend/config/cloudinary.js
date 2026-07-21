const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for course thumbnails (images)
const thumbnailStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'learnflow/thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 450, crop: 'fill' }],
  },
});

// Storage for lesson videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'learnflow/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
  },
});

// Storage for course resources (PDFs etc)
const resourceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'learnflow/resources',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'docx', 'pptx', 'zip'],
  },
});

module.exports = { cloudinary, thumbnailStorage, videoStorage, resourceStorage };
