<<<<<<< HEAD:backend/controllers/chatMessageController.js
import Message from '../models/chatMessageModel.js';
import { uploadChatFileToCloudinary } from '../config/cloudnaryConfig.js';

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('replyTo');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { content, sender, time, replyTo } = req.body;
    let file = req.file; // File is attached through the request
    let fileData = null;

    // Upload file to Cloudinary if it exists
    if (file) {
      const uploadResult = await uploadChatFileToCloudinary(file.path);
      fileData = {
        name: file.originalname,
        type: file.mimetype,
        url: uploadResult.url,
      };
    }

    const newMessage = new Message({
      content,
      sender,
      file: fileData, // Attach the uploaded file data
      time,
      replyTo: replyTo || null,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// Update a message by ID
export const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content, file, time } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { content, file, time, edited: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
=======
import Message from '../../../models/SuperAdmin/chatMessageModel.js';

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('replyTo');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { content, sender, file, time, replyTo } = req.body;


    const newMessage = new Message({
      content,
      sender,
      file: {
        name: file?.name || '',
        type: file?.type || '',
        url: file?.url || '',
      },
      time,
      replyTo: replyTo || null, // Assign the replyTo message ID if provided
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

// Update a message by ID
export const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content, file, time } = req.body;

  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { content, file, time, edited: true },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message by ID
export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
>>>>>>> 0b7919d077f24cd58163b4b69663a5271cd3e43d:backend/controllers/SuperAdmin/Message/chatMessageController.js
