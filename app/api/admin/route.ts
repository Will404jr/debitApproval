import { type NextRequest, NextResponse } from "next/server";
import { Admin } from "@/lib/models"; // Adjust import path as needed
import dbConnect from "@/lib/db";

// GET - Fetch all admins
export async function GET() {
  try {
    await dbConnect();
    const admins = await Admin.find({});
    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

// POST - Create a new admin
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const admin = new Admin(body);
    await admin.save();

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
