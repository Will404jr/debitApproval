import { Issue } from "@/lib/models/issues";
import dbConnect from "@/lib/db";

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

function addWorkingDays(date: Date, days: number): Date {
  const result = new Date(date);
  let daysAdded = 0;

  while (daysAdded < days) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) {
      daysAdded++;
    }
  }

  return result;
}

export async function updateOverdueIssues() {
  await dbConnect();

  const now = new Date();

  // Get all non-closed issues
  const activeIssues = await Issue.find({
    status: {
      $nin: ["Closed", "Overdue"],
    },
  });

  const bulkOps = activeIssues
    .map((issue) => {
      const createdAt = new Date(issue.createdAt);
      const daysAllowed = issue.status === "Urgent" ? 5 : 10;
      const dueDateWithWorkingDays = addWorkingDays(createdAt, daysAllowed);

      // If current date is past the calculated due date, mark as overdue
      if (now > dueDateWithWorkingDays) {
        return {
          updateOne: {
            filter: { _id: issue._id },
            update: { $set: { status: "Overdue" } },
          },
        };
      }
      return null;
    })
    .filter(
      (
        op
      ): op is {
        updateOne: {
          filter: { _id: any };
          update: { $set: { status: string } };
        };
      } => op !== null
    );

  if (bulkOps.length > 0) {
    const result = await Issue.bulkWrite(bulkOps);
    return result.modifiedCount;
  }

  return 0;
}
