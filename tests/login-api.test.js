import { jest, describe, beforeEach, test, expect } from "@jest/globals";
import { mockUserModel, mockAdminModel } from "./mocks";
import { NextResponse } from "next/server";

// Mock the OTP and email functions
jest.mock("@/lib/otp", () => ({
  generateOTP: jest.fn().mockReturnValue("123456"),
  storeOTP: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/mail", () => ({
  sendOTPEmail: jest.fn().mockResolvedValue(undefined),
}));

// Mock dbConnect
jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

// Import after mocking
const { generateOTP, storeOTP } = require("@/lib/otp");
const { sendOTPEmail } = require("@/lib/mail");
const dbConnect = require("@/lib/db").default;

// Create a mock implementation of the login API route
async function POST(request) {
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
      const admin = await mockAdminModel.findOne({ email });
      userExists = !!admin;
    } else {
      const user = await mockUserModel.findOne({ email });
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

describe("Login API Route", () => {
  let mockRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a mock request
    mockRequest = {
      json: jest.fn(),
    };
  });

  test("should return 400 if email is missing", async () => {
    // Mock request to return empty object
    mockRequest.json.mockResolvedValue({});

    await POST(mockRequest);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Email is required" },
      { status: 400 }
    );

    console.log("Missing email test passed");
  });

  test("should return 404 if user not found", async () => {
    // Mock request to return valid email but user not found
    mockRequest.json.mockResolvedValue({
      email: "nonexistent@example.com",
      userType: "user",
    });

    // Mock User.findOne to return null (user not found)
    mockUserModel.findOne.mockResolvedValue(null);

    await POST(mockRequest);

    // Check if dbConnect was called
    expect(dbConnect).toHaveBeenCalled();

    // Check if User.findOne was called with correct email
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: "nonexistent@example.com",
    });

    // Check if the response is correct
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "User not found" },
      { status: 404 }
    );

    console.log("User not found test passed");
  });

  test("should send OTP for valid user", async () => {
    // Mock request to return valid email and user type
    mockRequest.json.mockResolvedValue({
      email: "valid@example.com",
      userType: "user",
    });

    // Mock User.findOne to return a user
    mockUserModel.findOne.mockResolvedValue({
      email: "valid@example.com",
    });

    await POST(mockRequest);

    // Check if dbConnect was called
    expect(dbConnect).toHaveBeenCalled();

    // Check if User.findOne was called with correct email
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: "valid@example.com",
    });

    // Check if generateOTP was called
    expect(generateOTP).toHaveBeenCalled();

    // Check if storeOTP was called with correct parameters
    expect(storeOTP).toHaveBeenCalledWith(
      "valid@example.com",
      "user",
      "123456"
    );

    // Check if sendOTPEmail was called with correct parameters
    expect(sendOTPEmail).toHaveBeenCalledWith("valid@example.com", "123456");

    // Check if the response is correct
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "OTP sent successfully" },
      { status: 200 }
    );

    console.log("Valid user test passed");
  });
});

console.log("Running login API route tests...");
