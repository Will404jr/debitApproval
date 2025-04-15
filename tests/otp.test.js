import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import { mockOTPModel } from "./mocks";

// Mock the actual implementation
jest.mock("@/lib/otp", () => {
  // Store the original module to use for non-mocked functions
  const originalModule = jest.requireActual("@/lib/otp");

  return {
    __esModule: true,
    ...originalModule,
    // Mock specific functions as needed
    storeOTP: jest.fn().mockImplementation(async (email, userType, otp) => {
      return mockOTPModel.findOneAndUpdate.mockResolvedValueOnce({
        email,
        userType,
        otp,
        expiresAt: new Date(),
        isUsed: false,
      });
    }),
    verifyOTP: jest.fn().mockImplementation(async (email, userType, otp) => {
      const result = mockOTPModel.findOne();
      if (!result) return false;

      // If mockOTPModel.findOne is set to return a value, mark it as used
      if (result.then) {
        const resolvedResult = await result;
        if (resolvedResult) {
          resolvedResult.isUsed = true;
          await resolvedResult.save();
          return true;
        }
      }

      return false;
    }),
    cleanupExpiredOTPs: jest.fn().mockImplementation(async () => {
      const result = await mockOTPModel.deleteMany();
      return result.deletedCount || 0;
    }),
  };
});

// Import after mocking
const {
  generateOTP,
  storeOTP,
  verifyOTP,
  cleanupExpiredOTPs,
} = require("@/lib/otp");

describe("OTP Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("generateOTP should return a 6-digit number as string", () => {
    const otp = generateOTP();

    // Check if it's a string
    expect(typeof otp).toBe("string");

    // Check if it's 6 digits
    expect(otp.length).toBe(6);

    // Check if it's a number between 100000 and 999999
    const otpNum = parseInt(otp);
    expect(otpNum).toBeGreaterThanOrEqual(100000);
    expect(otpNum).toBeLessThanOrEqual(999999);

    console.log("Generated OTP:", otp);
  });

  // Add more tests as needed
});

console.log("Running OTP function tests...");
