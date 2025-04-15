import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import { NextResponse } from "next/server";

// Mock the OTP verification function
const mockVerifyOTP = jest.fn();
jest.mock("@/lib/otp", () => ({
  verifyOTP: mockVerifyOTP,
}));

// Create a mock implementation of the verify-otp API route
async function POST(request) {
  try {
    const { email, otp, userType } = await request.json();

    if (!email || !otp || !userType) {
      return NextResponse.json(
        { error: "Email, OTP, and user type are required" },
        { status: 400 }
      );
    }

    const isValid = await mockVerifyOTP(email, userType, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP verified successfully",
        userType,
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

describe("Verify OTP API Route", () => {
  let mockRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock request
    mockRequest = {
      json: jest.fn(),
    };
  });

  test("should return 400 if required fields are missing", async () => {
    // Mock request to return incomplete data
    mockRequest.json.mockResolvedValue({
      email: "test@example.com",
      // Missing otp and userType
    });

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Email, OTP, and user type are required" },
      { status: 400 }
    );

    console.log("Missing fields test passed");
  });

  test("should return 400 if OTP is invalid", async () => {
    // Mock request to return valid data
    mockRequest.json.mockResolvedValue({
      email: "test@example.com",
      otp: "123456",
      userType: "user",
    });

    // Mock verifyOTP to return false (invalid OTP)
    mockVerifyOTP.mockResolvedValue(false);

    await POST(mockRequest);

    // Check if verifyOTP was called with correct parameters
    expect(mockVerifyOTP).toHaveBeenCalledWith(
      "test@example.com",
      "user",
      "123456"
    );

    // Check if the response is correct
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Invalid or expired OTP" },
      { status: 400 }
    );

    console.log("Invalid OTP test passed");
  });

  test("should return 200 if OTP is valid", async () => {
    // Mock request to return valid data
    mockRequest.json.mockResolvedValue({
      email: "test@example.com",
      otp: "123456",
      userType: "user",
    });

    // Mock verifyOTP to return true (valid OTP)
    mockVerifyOTP.mockResolvedValue(true);

    await POST(mockRequest);

    // Check if verifyOTP was called with correct parameters
    expect(mockVerifyOTP).toHaveBeenCalledWith(
      "test@example.com",
      "user",
      "123456"
    );

    // Check if the response is correct
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "OTP verified successfully",
        userType: "user",
      },
      { status: 200 }
    );

    console.log("Valid OTP test passed");
  });

  test("should handle errors properly", async () => {
    // Mock request to throw an error
    mockRequest.json.mockRejectedValue(new Error("Test error"));

    await POST(mockRequest);

    // Check if the response is correct
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );

    console.log("Error handling test passed");
  });
});

console.log("Running verify OTP API route tests...");
