import mongoose, { Model } from "mongoose";
 interface IDelegateUser extends Document {
  name: string;
  organisation: string;
  city: string;
  mobile: string;
  email: string;
  query?: string;
  category: string;
  payment_type: string;
  transaction_no: number;
  amount: number;
  other_details?: string;
  tracking_id: number;
  createdAt?: Date;
  updatedAt?: Date;
  department:string
  session_type:string
  postal_address:string
}
const delegateUserSchema = new mongoose.Schema<IDelegateUser>(
  {
    name: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
      department: {
      type: String,
      required: true,
    },
     postal_address: {
      type: String,
      required: true,
    },
    city: {
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
    query: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
      session_type: {
      type: String,
      required: false,
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
const DelegateUser:Model<IDelegateUser> =
  mongoose.models.delegateUser ||
  mongoose.model("delegateUser", delegateUserSchema);
export default DelegateUser;
