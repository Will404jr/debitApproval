import { OTP } from "@/lib/models";
import dbConnect from "@/lib/db";

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP in the database with expiration (5 minutes)
export async function storeOTP(
  email: string,
  userType: string,
  otp: string
): Promise<void> {
  await dbConnect();

  // Set expiration time to 5 minutes from now
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Find and update existing OTP or create a new one
  await OTP.findOneAndUpdate(
    { email, userType },
    {
      otp,
      expiresAt,
      isUsed: false,
    },
    { upsert: true, new: true }
  );
}

// Verify OTP from the database
export async function verifyOTP(
  email: string,
  userType: string,
  otp: string
): Promise<boolean> {
  await dbConnect();

  // Find a valid OTP
  const otpRecord = await OTP.findOne({
    email,
    userType,
    otp,
    expiresAt: { $gt: new Date() }, // Not expired
    isUsed: false, // Not used
  });

  if (!otpRecord) {
    return false;
  }

  // Mark OTP as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  return true;
}

// Clean up expired OTPs (can be called periodically if needed)
export async function cleanupExpiredOTPs(): Promise<number> {
  await dbConnect();

  const result = await OTP.deleteMany({
    $or: [{ expiresAt: { $lte: new Date() } }, { isUsed: true }],
  });

  return result.deletedCount;
}
