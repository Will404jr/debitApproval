import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["Open", "Closed", "Pending", "Overdue"],
      default: "Open",
      required: true,
    },
    submittedBy: { type: String, required: true },
    assignedTo: { type: String, default: null },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Issue =
  mongoose.models.Issue || mongoose.model("Issue", issueSchema);
