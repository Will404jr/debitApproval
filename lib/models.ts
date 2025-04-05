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
