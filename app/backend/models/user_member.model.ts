import mongoose, { Document, Model } from "mongoose";

interface IUserMember extends Document {
  name: string;
  organisation?: string;
  password?: string;
  designation?: string;
  city?: string;
  country?: string;
  mobile?: string;
  email: string;
  token: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isVerified: boolean;
  isLinkExpired: boolean;
  tracking_id: string;
  role: string;
  tokenGeneratedTime: number;
  verifiedToken?: string;
}
const userMember = new mongoose.Schema<IUserMember>(
  {
    name: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: false,
    },
    password: {
      type: String,
    },
    designation: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      sparse: true,
      unique: [true, "This mobile number is already exist"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "This email is aready exist"],
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isLinkExpired: {
      type: Boolean,
      required: true,
      default: false,
    },
    tracking_id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: "regular",
    },
    tokenGeneratedTime: {
      type: Number,
      required: true,
      default: Date.now(),
    },
    verifiedToken: {
      type: String,
    },
  },
  { timestamps: true }
);
const UserMember:Model<IUserMember> =
  mongoose.models.userMember || mongoose.model("userMember", userMember);
export default UserMember;
