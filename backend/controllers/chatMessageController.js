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
    const { content, sender, time, replyTo } = req.body; // Extract message fields from req.body
    let fileData = null;

    // Check if a file is provided in the request
    if (req.file) {
      // Call the upload function to upload the file
      const uploadResult = await uploadChatFileToCloudinary(req.file.path);
      // Construct the file object to save with the message
      fileData = { name: req.file.originalname, type: req.file.mimetype, url: uploadResult.url };
    }

    // Construct the message object to be saved
    const newMessage = {
      content,
      sender,
      time,
      file: fileData,  // Include file data if available
      replyTo: replyTo ? {
        _id: replyTo._id,
        content: replyTo.content,
        sender: replyTo.sender,
        time: replyTo.time
      } : null,
      edited: false,
    };

    // Save the new message to the database
    const savedMessage = await Message.create(newMessage);  

    res.status(201).json(savedMessage);  // Respond with the created message
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
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
