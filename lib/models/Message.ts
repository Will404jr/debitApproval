import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  message: { type: String, required: true }, // Changed from 'content' to 'message'
  timestamp: { type: Date, default: Date.now },
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
