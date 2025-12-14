import mongoose, { Document, Schema, Model } from "mongoose";

export interface IVisitorRegistration extends Document {
  name: string;
  organisation: string;
  city: string;
  mobile: string;
  email: string;
  area_of_work: string;
  tracking_id: number;
  unique_reference_number: string;
  createdAt: Date;
  updatedAt: Date;
}

const visitorSchema = new Schema<IVisitorRegistration>(
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
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    area_of_work: {
      type: String,
      required: true,
    },
    tracking_id: {
      type: Number,
      required: true,
      unique: true,
      default: Date.now(),
    },
    unique_reference_number: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const VisitorRegistration: Model<IVisitorRegistration> =
  mongoose.models?.visitorRegistrationUser ||
  mongoose.model<IVisitorRegistration>(
    "visitorRegistrationUser",
    visitorSchema
  );

export default VisitorRegistration;
