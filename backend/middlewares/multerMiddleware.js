import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for general assets (EunivateAssets)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'EunivateAssets', // The folder in Cloudinary where files will be stored
    allowedFormats: ['jpg', 'png'],
  },
});

// Multer upload middleware for general assets
const upload = multer({ storage: storage });

// Configure Cloudinary storage for chat files (ChatFiles)
const chatFileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ChatFiles', // The folder in Cloudinary where chat files will be stored
    resource_type: 'auto', // This allows uploading of any file type (images, audio, documents, etc.)
  },
});

// Multer upload middleware for chat files
const uploadChatFiles = multer({ storage: chatFileStorage });

export { upload, uploadChatFiles };
