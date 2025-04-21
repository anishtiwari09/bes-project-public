import mongoose from "mongoose";

const delegateUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
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
    query: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    payment_type: {
      type: String,
      required: true,
    },
    transaction_no: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    other_details: {
      type: String,
      required: false,
    },
    tracking_id: {
      type: Number,
      required: true,
      unique: true,
      default: Date.now(),
    },
  },
  { timestamps: true }
);
const DelegateUser =
  mongoose.models.delegateUser ||
  mongoose.model("delegateUser", delegateUserSchema);
export default DelegateUser;
