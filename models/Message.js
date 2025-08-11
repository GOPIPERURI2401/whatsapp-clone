const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  wa_id: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  fromMe: {
    type: Boolean,
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  timestamp: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true 
});

// ✅ This line is very important. It sets the collection name.
const Message = mongoose.model('Message', messageSchema, 'processed_messages');

module.exports = Message;
