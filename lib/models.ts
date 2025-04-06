import mongoose from "mongoose";

// admin schema
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// user schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

// bank schema
const bankSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    representativeName: { type: String, required: true },
    representativePhoneNumber: { type: String, required: true },
    representativeEmail: { type: String, required: true },
    bankIdentificationNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const Bank = mongoose.models.Bank || mongoose.model("Bank", bankSchema);

// debitData schema
const debitDataSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true },
    transactionDate: { type: Date, required: true },
    nssfReferenceNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    justification: { type: String, required: true },
  },
  { timestamps: true }
);

export const DebitData =
  mongoose.models.DebitData || mongoose.model("DebitData", debitDataSchema);

// OTP schema
const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    userType: { type: String, enum: ["user", "admin"], required: true },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    }, // 5 minutes from now
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a TTL index that automatically deletes documents after they expire
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create a compound index for faster lookups
otpSchema.index({ email: 1, userType: 1 });

export const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);
