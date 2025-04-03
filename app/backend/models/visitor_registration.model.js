const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
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
    unique_reference_number:{
      type:String,
      required:true,
      unique:true,
    
    }
    
  },
  { timestamps: true }
);
const VisitorRegistration = mongoose.models?.visitorRegistrationUser || mongoose.model("visitorRegistrationUser", Schema);

export default VisitorRegistration;
