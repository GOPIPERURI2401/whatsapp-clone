const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Message = require('../models/Message');

const payloadsDir = path.join(__dirname, '../sample-payloads');

const processPayloads = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in .env file. Exiting.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Script connected to MongoDB...');
  } catch (error) {
    console.error('❌ MongoDB connection error in script:', error);
    process.exit(1);
  }

  try {
    const files = fs.readdirSync(payloadsDir).filter(file => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(payloadsDir, file);
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const value = payload.metaData?.entry?.[0]?.changes?.[0]?.value;

      if (!value) continue;

      const { metadata, messages, statuses, contacts } = value;

      if (messages?.length > 0) {
        const contact = contacts[0]; // The contact is always the other person in the chat
        for (const msg of messages) {
          if (msg.type !== 'text') continue;

          const isFromMe = msg.from === metadata.display_phone_number;
          const messageData = {
            messageId: msg.id,
            wa_id: contact.wa_id, // Always use the contact's ID for the conversation
            name: contact.profile.name,
            body: msg.text.body,
            fromMe: isFromMe,
            timestamp: parseInt(msg.timestamp, 10),
          };
          await Message.findOneAndUpdate({ messageId: msg.id }, messageData, { upsert: true });
        }
      }

      if (statuses?.length > 0) {
        for (const statusUpdate of statuses) {
          await Message.updateOne({ messageId: statusUpdate.id }, { $set: { status: statusUpdate.status } });
        }
      }
    }
    console.log('\n🎉 All payloads processed successfully!');
  } catch (error) {
    console.error('❌ An error occurred during file processing:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Script disconnected from MongoDB.');
  }
};

processPayloads();