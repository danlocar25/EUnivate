import express from 'express';
<<<<<<< HEAD
import multer from 'multer'; // Make sure multer is imported
import {
  getMessages,
  sendMessage,  // Make sure this is imported
  updateMessage,
  deleteMessage,
} from '../controllers/chatMessageController.js';
import { uploadChatFileToCloudinary } from '../config/cloudnaryConfig.js'; // Ensure correct import path
import { uploadChatFiles as chatFileUpload } from '../middlewares/multerMiddleware.js';
=======
import { getMessages, sendMessage, updateMessage, deleteMessage } from '../controllers/SuperAdmin/Message/chatMessageController.js';
>>>>>>> a12298df83a5658fe3effd47aaf776844b9a27ef

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage

// Route to get all messages
router.get('/', getMessages);

// Route to send a new message
router.post('/', chatFileUpload.single('file'), sendMessage);  // This route handles sending a new message

// Define the upload route for uploading files
router.post('/uploadFile', upload.single('file'), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const uploadResult = await uploadChatFileToCloudinary(req.file.path);
    res.json({ url: uploadResult.url }); // Return the uploaded file URL
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Route to update a message by ID
router.put('/:id', updateMessage);

// Route to delete a message by ID
router.delete('/:id', deleteMessage);

export default router;