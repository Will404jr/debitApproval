// OTP storage - in production, use a database
interface OTPRecord {
  otp: string;
  email: string;
  userType: string;
  expiresAt: number;
}

// In-memory OTP storage (for demo purposes)
// In production, use a database to store OTPs
const otpStore: OTPRecord[] = [];

// Generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP with expiration (5 minutes)
export function storeOTP(email: string, userType: string, otp: string): void {
  // Remove any existing OTPs for this email
  const existingIndex = otpStore.findIndex(
    (record) => record.email === email && record.userType === userType
  );

  if (existingIndex !== -1) {
    otpStore.splice(existingIndex, 1);
  }

  // Store new OTP with 5-minute expiration
  otpStore.push({
    email,
    userType,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
}

// Verify OTP
export function verifyOTP(
  email: string,
  userType: string,
  otp: string
): boolean {
  const recordIndex = otpStore.findIndex(
    (record) =>
      record.email === email &&
      record.userType === userType &&
      record.otp === otp &&
      record.expiresAt > Date.now()
  );

  if (recordIndex !== -1) {
    // Remove the OTP after successful verification
    otpStore.splice(recordIndex, 1);
    return true;
  }

  return false;
}
