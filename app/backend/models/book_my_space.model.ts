import mongoose, { Model } from "mongoose";
 interface IBookMySpace extends Document {
  name: string;
  organisation: string;
  designation?: string;
  city: string;
  country: string;
  mobile: string;
  email: string;
  how_did_you_hear_about_expo?: string;
  tracking_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}
const bookMySpace = new mongoose.Schema<IBookMySpace>(
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
const BookMySpace:Model<IBookMySpace> =
  mongoose.models.bookMySpace || mongoose.model("bookMySpace", bookMySpace);
export default BookMySpace;
