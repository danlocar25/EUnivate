import express from 'express';
import { getMessages, sendMessage, updateMessage, deleteMessage } from '../controllers/chatMessageController.js';
import { uploadChatFiles as chatFileUpload } from '../middlewares/multerMiddleware.js';


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
