import { type NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";
import { getSession } from "@/lib/session";
import { Admin, User } from "@/lib/models";
import dbConnect from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, otp, userType } = await request.json();

    if (!email || !otp || !userType) {
      return NextResponse.json(
        { error: "Email, OTP, and user type are required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = verifyOTP(email, userType, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user details
    let userData = null;
    if (userType === "admin") {
      userData = await Admin.findOne({ email });
    } else {
      userData = await User.findOne({ email });
    }

    if (!userData) {
      return NextResponse.json(
        { error: `${userType === "admin" ? "Admin" : "User"} not found` },
        { status: 404 }
      );
    }

    // Create session
    const session = await getSession();
    session.isLoggedIn = true;
    session.email = email;
    session.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await session.save();

    return NextResponse.json(
      {
        message: "OTP verified successfully",
        user: {
          email: userData.email,
          userType,
          ...(userType === "user"
            ? { firstName: userData.firstName, lastName: userData.lastName }
            : { username: userData.username }),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
