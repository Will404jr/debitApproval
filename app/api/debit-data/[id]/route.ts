import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { DebitData } from "@/lib/models";
import dbConnect from "@/lib/db";

// GET - Fetch a specific debit data entry by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid debit data ID" },
        { status: 400 }
      );
    }

    const debitData = await DebitData.findById(id)
      .populate("user")
      .populate("bank");

    if (!debitData) {
      return NextResponse.json(
        { error: "Debit data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(debitData, { status: 200 });
  } catch (error) {
    console.error("Error fetching debit data:", error);
    return NextResponse.json(
      { error: "Failed to fetch debit data" },
      { status: 500 }
    );
  }
}

// PUT - Update a debit data entry by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid debit data ID" },
        { status: 400 }
      );
    }

    // Validate that user and bank IDs exist if they are being updated
    if (body.user && !mongoose.Types.ObjectId.isValid(body.user)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (body.bank && !mongoose.Types.ObjectId.isValid(body.bank)) {
      return NextResponse.json({ error: "Invalid bank ID" }, { status: 400 });
    }

    const updatedDebitData = await DebitData.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("user")
      .populate("bank");

    if (!updatedDebitData) {
      return NextResponse.json(
        { error: "Debit data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDebitData, { status: 200 });
  } catch (error) {
    console.error("Error updating debit data:", error);
    return NextResponse.json(
      { error: "Failed to update debit data" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a debit data entry by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await dbConnect();
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid debit data ID" },
        { status: 400 }
      );
    }

    const deletedDebitData = await DebitData.findByIdAndDelete(id);

    if (!deletedDebitData) {
      return NextResponse.json(
        { error: "Debit data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Debit data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting debit data:", error);
    return NextResponse.json(
      { error: "Failed to delete debit data" },
      { status: 500 }
    );
  }
}
