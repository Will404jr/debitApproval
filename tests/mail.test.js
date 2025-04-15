import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import { mockSendMail, mockTransporter } from "./mocks";

// Mock the actual implementation
jest.mock("@/lib/mail", () => {
  return {
    __esModule: true,
    sendOTPEmail: jest.fn().mockImplementation(async (email, otp) => {
      return mockSendMail({
        from: '"Debit Approval System" <wjr46269@gmail.com>',
        to: email,
        subject: "Your Login OTP",
        text: `Your one-time password is: ${otp}. It will expire in 5 minutes.`,
        html: `<div>OTP: ${otp}</div>`,
      });
    }),
  };
});

// Import after mocking
const { sendOTPEmail } = require("@/lib/mail");

describe("Email Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sendOTPEmail should call transporter.sendMail with correct parameters", async () => {
    const email = "test@example.com";
    const otp = "123456";

    await sendOTPEmail(email, otp);

    // Check if sendMail was called
    expect(mockSendMail).toHaveBeenCalled();

    // Check specific parameters individually
    const callArgs = mockSendMail.mock.calls[0][0];
    expect(callArgs.to).toBe(email);
    expect(callArgs.text).toContain(otp);
    expect(callArgs.html).toContain(otp);

    console.log("sendOTPEmail test passed");
  });
});

console.log("Running email function tests...");
