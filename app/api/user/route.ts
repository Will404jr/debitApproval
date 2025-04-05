import { type NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/models";
import dbConnect from "@/lib/db";

// GET - Fetch all users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const user = new User(body);
    await user.save();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
