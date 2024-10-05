import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: false,  
  },
  sender: {
    name: { type: String, required: true },
    avatar: { type: String, required: false }, 
  },
  file: {
    publicId: {
      type: String,
      required: false, //optional 
    },
    url: {
      type: String,
      required: false,
    },
  },
  time: {
    type: Date, // Using Date instead of String for timestamps
    default: Date.now, // Default to the current time
  },
  edited: {
    type: Boolean,
    default: false,
  },
  replyTo: {  // Reference to another message
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
    default: null,
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
