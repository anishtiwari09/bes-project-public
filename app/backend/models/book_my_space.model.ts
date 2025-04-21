import mongoose from "mongoose";

const bookMySpace = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
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

    how_did_you_hear_about_expo: {
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
const BookMySpace =
  mongoose.models.bookMySpace || mongoose.model("bookMySpace", bookMySpace);
export default BookMySpace;
