import { Schema, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: Schema.Types.ObjectId;
  designation: string;

  mobile_no: string;
  membership_number: string;
  membership_type: string[];
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  resumeUrl?: string;
  updatedAt: Date;
}
export const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    designation: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      country: { type: String, required: true },
      required: true,
    },
    mobile_no: { type: String, required: true },
    membership_number: { type: String, required: true, unique: true },
    membership_type: { type: [String], required: true },

    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
