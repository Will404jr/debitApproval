import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  recipientId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // New field for tracking read status
});

export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
