import nodemailer from "nodemailer";

// Create a transporter
const transporter = nodemailer.createTransport({
  host: "192.168.192.160",
  port: 25,
});

// Send OTP email
export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: "<debitapproval@nssfug.org>",
    to: email,
    subject: "Your Login OTP",
    text: `Your one-time password is: ${otp}. It will expire in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="background-color: #094171; padding: 15px; border-radius: 5px 5px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Debit Approval System</h1>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">Your one-time password (OTP) for login is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h2 style="font-size: 28px; letter-spacing: 5px; margin: 0; color: #094171;">${otp}</h2>
          </div>
          <p style="font-size: 16px; color: #333;">This OTP will expire in 5 minutes.</p>
          <p style="font-size: 16px; color: #333;">If you didn't request this OTP, please ignore this email.</p>
          <p style="font-size: 16px; color: #333;">Thank you,<br>Debit Approval System Team</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #666;">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
