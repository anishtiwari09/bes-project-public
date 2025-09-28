import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  passwordHash?: string;
  role: "admin" | "regular";
  status:
    | "pending_email_verification"
    | "email_verified"
    | "profile_completed"
    | "approved"
    | "rejected";
  rejectionMsg?: string;
  createdAt: Date;
  updatedAt: Date;
  verificationToken: string;
  verificationTokenExpires: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["regular", "admin"],
    },
    status: {
      type: String,
      enum: [
        "pending_email_verification",
        "email_verified",
        "profile_completed",
        "approved",
        "rejected",
      ],
      default: "pending_email_verification",
    },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    rejectionMsg: { type: String }, // optional, only set if rejected
  },
  { timestamps: true }
);
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
