import { type NextRequest, NextResponse } from "next/server";
import { Bank } from "@/lib/models";
import dbConnect from "@/lib/db";

// GET - Fetch all banks
export async function GET() {
  try {
    await dbConnect();
    const banks = await Bank.find({});
    return NextResponse.json(banks, { status: 200 });
  } catch (error) {
    console.error("Error fetching banks:", error);
    return NextResponse.json(
      { error: "Failed to fetch banks" },
      { status: 500 }
    );
  }
}

// POST - Create a new bank
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const bank = new Bank(body);
    await bank.save();

    return NextResponse.json(bank, { status: 201 });
  } catch (error) {
    console.error("Error creating bank:", error);
    return NextResponse.json(
      { error: "Failed to create bank" },
      { status: 500 }
    );
  }
}
