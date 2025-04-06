import { type NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP } from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mail";
import { Admin, User } from "@/lib/models";
import dbConnect from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, userType } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Check if the user exists based on userType
    let userExists = false;

    if (userType === "admin") {
      const admin = await Admin.findOne({ email });
      userExists = !!admin;
    } else {
      const user = await User.findOne({ email });
      userExists = !!user;
    }

    if (!userExists) {
      return NextResponse.json(
        { error: `${userType === "admin" ? "Admin" : "User"} not found` },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in database
    await storeOTP(email, userType, otp);

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to process login request" },
      { status: 500 }
    );
  }
}
