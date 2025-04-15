import { jest, beforeEach } from "@jest/globals";

// Mock models
export const mockOTPModel = {
  findOneAndUpdate: jest.fn(),
  findOne: jest.fn(),
  deleteMany: jest.fn(),
};

export const mockUserModel = {
  findOne: jest.fn(),
};

export const mockAdminModel = {
  findOne: jest.fn(),
};

// Mock the models module
jest.mock("@/lib/models", () => ({
  OTP: mockOTPModel,
  User: mockUserModel,
  Admin: mockAdminModel,
})),
  { virtual: true };

// Mock the dbConnect function
jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
})),
  { virtual: true };

// Mock nodemailer
const mockSendMail = jest
  .fn()
  .mockResolvedValue({ messageId: "test-message-id" });
const mockTransporter = {
  sendMail: mockSendMail,
};

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue(mockTransporter),
})),
  { virtual: true };

export { mockSendMail, mockTransporter };

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
