const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Message = require('./models/Message');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// --- API Endpoints ---

// POST a new message
app.post('/api/messages/send', async (req, res) => {
  try {
    const { body, wa_id, name } = req.body;

    if (!body || !wa_id || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newMessage = await Message.create({
      messageId: new mongoose.Types.ObjectId().toString(),
      wa_id: wa_id,
      name: name,
      body: body,
      fromMe: true,
      status: 'sent',
      timestamp: Math.floor(Date.now() / 1000),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all unique conversations
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          lastMessage: { $first: '$body' },
          lastMessageTimestamp: { $first: '$timestamp' },
        },
      },
      { $sort: { lastMessageTimestamp: -1 } },
    ]);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all messages for a specific conversation
app.get('/api/messages/:wa_id', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const messages = await Message.find({ wa_id: wa_id }).sort({ timestamp: 'asc' });

    if (!messages) {
      return res.status(404).json({ message: 'No messages found for this user.' });
    }

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// --- Test Route ---
app.get('/', (req, res) => {
  res.send('WhatsApp Web Clone Backend is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));