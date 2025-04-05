import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { DebitData } from "@/lib/models";
import dbConnect from "@/lib/db";

// GET - Fetch all debit data entries
export async function GET() {
  try {
    await dbConnect();
    const debitData = await DebitData.find({})
      .populate("user")
      .populate("bank");
    return NextResponse.json(debitData, { status: 200 });
  } catch (error) {
    console.error("Error fetching debit data:", error);
    return NextResponse.json(
      { error: "Failed to fetch debit data" },
      { status: 500 }
    );
  }
}

// POST - Create a new debit data entry
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate that user and bank IDs exist
    if (
      !mongoose.Types.ObjectId.isValid(body.user) ||
      !mongoose.Types.ObjectId.isValid(body.bank)
    ) {
      return NextResponse.json(
        { error: "Invalid user or bank ID" },
        { status: 400 }
      );
    }

    const debitData = new DebitData(body);
    await debitData.save();

    // Populate the references for the response
    const populatedDebitData = await DebitData.findById(debitData._id)
      .populate("user")
      .populate("bank");

    return NextResponse.json(populatedDebitData, { status: 201 });
  } catch (error) {
    console.error("Error creating debit data:", error);
    return NextResponse.json(
      { error: "Failed to create debit data" },
      { status: 500 }
    );
  }
}
