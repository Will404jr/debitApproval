import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Issue } from "@/lib/models/issues";
import dbConnect from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    await dbConnect();

    const { status } = await request.json();

    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    if (issue.assignedTo !== session.username) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Error resolving issue:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
