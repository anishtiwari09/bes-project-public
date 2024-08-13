import mongoose from "mongoose";

const userMember = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: false,
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
      required: true,
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
      default: false,
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
      type: Number,
      required: true,
      unique: true,
      default: Date.now(),
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
  },
  { timestamps: true }
);
const UserMember =
  mongoose.models.userMember || mongoose.model("userMember", userMember);
export default UserMember;
