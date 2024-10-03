import express from 'express';
<<<<<<< HEAD
import { getMessages, sendMessage, updateMessage, deleteMessage } from '../controllers/chatMessageController.js';
import { uploadChatFiles as chatFileUpload } from '../middlewares/multerMiddleware.js';

=======
import { getMessages, sendMessage, updateMessage, deleteMessage } from '../controllers/SuperAdmin/Message/chatMessageController.js';
>>>>>>> 0b7919d077f24cd58163b4b69663a5271cd3e43d

const router = express.Router();

// Route to get all messages
router.get('/', getMessages);

// Route to send a new message (with file upload)
router.post('/', chatFileUpload.single('file'), sendMessage);

// Route to update a message by ID
router.put('/:id', updateMessage);

// Route to delete a message by ID
router.delete('/:id', deleteMessage);

export default router;