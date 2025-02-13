import { Issue } from "@/lib/models/issues";
import dbConnect from "@/lib/db";

export async function updateOverdueIssues() {
  await dbConnect();

  const now = new Date();

  const overdueIssues = await Issue.updateMany(
    {
      status: { $ne: "Closed" },
      dueDate: { $lt: now },
    },
    { $set: { status: "Overdue" } }
  );

  return overdueIssues.modifiedCount;
}
