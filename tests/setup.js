// Mock database connection
import mongoose from "mongoose";
import { jest } from "@jest/globals";

// Mock models
const mockOTPModel = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
  deleteMany: jest.fn(),
};

const mockUserModel = {
  findOne: jest.fn(),
};

const mockAdminModel = {
  findOne: jest.fn(),
};

// Mock the models module
jest.mock("@/lib/models", () => ({
  OTP: mockOTPModel,
  User: mockUserModel,
  Admin: mockAdminModel,
}));

// Mock the dbConnect function
jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: "test-message-id" }),
  }),
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

export { mockOTPModel, mockUserModel, mockAdminModel };

console.log("Test setup complete");
