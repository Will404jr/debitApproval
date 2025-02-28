import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "Closed", "Pending", "Overdue", "Urgent"],
      default: "Open",
      required: true,
    },
    submittedBy: { type: String, required: true },
    assignedTo: { type: String, default: null },
    approved: { type: Boolean, default: false },
    reslvedComment: { type: String, default: null },
    rating: {
      type: String,
      enum: ["Good", "Fair", "Bad"],
      default: null,
      required: false,
    },
  },
  { timestamps: true }
);

export const Issue =
  mongoose.models.Issue || mongoose.model("Issue", issueSchema);
