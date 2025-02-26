import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    await dbConnect();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const createdAt = new Date(issue.createdAt);
    const daysAllowed = issue.status === "Urgent" ? 5 : 10;
    const dueDateWithWorkingDays = addWorkingDays(createdAt, daysAllowed);
    const now = new Date();

    // Check if the issue should be marked as overdue
    if (now > dueDateWithWorkingDays && issue.status !== "Closed") {
      const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        { status: "Overdue" },
        {
          new: true,
          runValidators: true,
        }
      );

      return NextResponse.json(updatedIssue);
    }

    // If not overdue, return the original issue
    return NextResponse.json(issue);
  } catch (error) {
    console.error("Error updating issue:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
