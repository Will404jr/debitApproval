import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Bank } from "@/lib/models";
import dbConnect from "@/lib/db";
// GET - Fetch a specific bank by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bank ID" }, { status: 400 });
    }

    const bank = await Bank.findById(id);

    if (!bank) {
      return NextResponse.json({ error: "Bank not found" }, { status: 404 });
    }

    return NextResponse.json(bank, { status: 200 });
  } catch (error) {
    console.error("Error fetching bank:", error);
    return NextResponse.json(
      { error: "Failed to fetch bank" },
      { status: 500 }
    );
  }
}

// PUT - Update a bank by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bank ID" }, { status: 400 });
    }

    const updatedBank = await Bank.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedBank) {
      return NextResponse.json({ error: "Bank not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBank, { status: 200 });
  } catch (error) {
    console.error("Error updating bank:", error);
    return NextResponse.json(
      { error: "Failed to update bank" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a bank by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid bank ID" }, { status: 400 });
    }

    const deletedBank = await Bank.findByIdAndDelete(id);

    if (!deletedBank) {
      return NextResponse.json({ error: "Bank not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Bank deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bank:", error);
    return NextResponse.json(
      { error: "Failed to delete bank" },
      { status: 500 }
    );
  }
}
