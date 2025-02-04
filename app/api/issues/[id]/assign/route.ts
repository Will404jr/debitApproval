import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Issue } from "@/lib/models/issues"; // Adjust this import path as needed
import dbConnect from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const id = params.id;
    const { assignedTo, status } = await request.json();

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { assignedTo, status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(updatedIssue);
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
